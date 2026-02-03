const User = require('../models/User');

/**
 * Dynamic RBAC middleware
 * Checks if a user has a specific permission or role
 */
exports.checkPermission = (permission) => {
    return async (req, res, next) => {
        try {
            const user = req.user;

            // Superadmin has all permissions
            if (user.role === 'superadmin') {
                return next();
            }

            // Check if user has explicit permission
            if (user.permissions && user.permissions.includes(permission)) {
                return next();
            }

            // Define default role-based permissions if not explicitly set
            const rolePermissions = {
                admin: ['manage_posts', 'manage_comments', 'manage_users', 'view_stats'],
                user: ['create_post', 'edit_own_post', 'delete_own_post', 'create_comment', 'like_post']
            };

            const allowedPermissions = rolePermissions[user.role] || [];

            if (allowedPermissions.includes(permission)) {
                return next();
            }

            return res.status(403).json({
                success: false,
                message: `User does not have permission: ${permission}`
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    };
};
