
var express = require('express');
var router = express.Router();
let userController = require('../controllers/users')
let { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler')
let{check_authentication,check_authorization} = require('../utils/check_auth');
const constants = require('../utils/constants');
const User = require('../schemas/user');
const bcrypt = require('bcrypt');

router.put('/toggle-status/:id', async function (req, res) {
    try {
        const { id } = req.params;
        const { isDelete } = req.body;

        // Cập nhật trạng thái isDelete
        const user = await User.findByIdAndUpdate(
            id,
            { isDelete },
            { new: true } // Trả về document đã cập nhật
        );

        if (!user) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }

        res.status(200).send({ success: true, message: 'User status updated successfully', user });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).send({ success: false, message: 'Failed to update user status' });
    }
});
router.put('/:id', async function (req, res, next) {
    try {
        const { fullName, email, avatarUrl, currentPassword, newPassword } = req.body;

        // Tìm người dùng theo ID
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }

        // Cập nhật thông tin cá nhân
        if (fullName) user.fullname = fullName;
        if (email) user.email = email;
        if (avatarUrl) user.avatarUrl = avatarUrl;

        // Đặt lại mật khẩu nếu có
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).send({
                    success: false,
                    message: 'Current password is incorrect',
                });
            }
            user.password = newPassword; // Mật khẩu mới sẽ được mã hóa trong middleware `pre('save')`
        }

        // Lưu thay đổi
        await user.save();

        res.status(200).send({
            success: true,
            message: 'Profile updated successfully',
            user: {
                fullName: user.fullname,
                email: user.email,
                avatarUrl: user.avatarUrl,
            },
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send({
            success: false,
            message: 'Failed to update profile',
        });
    }
});

router.get('/', check_authentication, check_authorization(constants.MOD_PERMISSION), async function (req, res, next) {
    try {
        const users = await User.find().select('_id username email createdAt');
        res.status(200).send(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({
            success: false,
            message: 'Failed to fetch users',
        });
    }
});
router.post('/', async function (req, res, next) {
  try {
    let body = req.body;
    let newUser = await userController.CreateAnUser(body.username, body.password, body.email, body.role);
    CreateSuccessResponse(res, 200, newUser)
  } catch (error) {
    CreateErrorResponse(res, 404, error.message)
  }
});
router.put('/:id', async function (req, res, next) {
  try {
    let body = req.body;
    let updatedResult = await userController.UpdateAnUser(req.params.id, body);
    CreateSuccessResponse(res, 200, updatedResult)
  } catch (error) {
    next(error)
  }
});
router.put('/update/:id', async function (req, res) {
  try {
      const { fullName, email, avatarUrl, currentPassword, newPassword } = req.body;

      // Tìm người dùng theo ID
      const user = await User.findById(req.params.id);
      if (!user) {
          return res.status(404).send({
              success: false,
              message: 'User not found',
          });
      }

      // Cập nhật thông tin cá nhân
      if (fullName) user.fullname = fullName;
      if (email) user.email = email;
      if (avatarUrl) user.avatarUrl = avatarUrl;

      // Đặt lại mật khẩu nếu có
      if (currentPassword && newPassword) {
          const isMatch = await bcrypt.compare(currentPassword, user.password);
          if (!isMatch) {
              return res.status(400).send({
                  success: false,
                  message: 'Current password is incorrect',
              });
          }
          user.password = newPassword; // Mật khẩu mới sẽ được mã hóa trong middleware `pre('save')`
      }

      // Lưu thay đổi
      await user.save();

      res.status(200).send({
          success: true,
          message: 'Profile updated successfully',
          user: {
              fullName: user.fullname,
              email: user.email,
              avatarUrl: user.avatarUrl,
          },
      });
  } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).send({
          success: false,
          message: 'Failed to update profile',
      });
  }
});
router.get('/details', check_authentication, async (req, res) => {
  try {
      const user = await User.findById(req.user.id).select('_id fullName email avatarUrl');
      if (!user) {
          return res.status(404).send({
              success: false,
              message: 'User not found',
          });
      }

      res.status(200).send(user);
  } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).send({
          success: false,
          message: 'Failed to fetch user details',
      });
  }
});
module.exports = router;
