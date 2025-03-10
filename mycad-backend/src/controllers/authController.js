import bcrypt from "bcryptjs";
import { db } from "../lib/db.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
  const { firstName, lastName, email, userName, password, roleId } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        userName,
        password: hashedPassword,
        roleId,
      },
    });

    res.status(201).json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userName: user.userName,
        roleId: user.roleId,
      },
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.user.findFirst({
      where: {
        OR: [{ email }, { userName: email }],
        enabled: true,
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        photo: {
          where: { enabled: true },
        },
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      user.password = undefined;
      user.photo = user?.photo?.[0] || null;
      user.authPermissions = user.role.permissions.map(
        (rolePermission) => rolePermission.permission.name
      );
      res.json({
        user,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid email, user or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loadUser = async (req, res) => {
  const { user } = req;

  try {
    if (user) {
      const loadedUser = await db.user.findFirst({
        where: { id: user.id, enabled: true },
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
          photo: {
            where: { enabled: true },
          },
        },
      });

      if (!loadedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      loadedUser.authPermissions = loadedUser.role.permissions.map(
        (rolePermission) => rolePermission.permission.name
      );

      loadedUser.password = undefined;
      loadedUser.photo = loadedUser?.photo?.[0] || null;

      res.json(loadedUser);
    } else {
      console.log("Error: User not found");
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } catch (error) {
    console.log("Error on loadUser: ", error.message);
    res.status(500).json({ message: error.message });
    c;
  }
};

export const logout = async (req, res) => {
  res.json({ message: "Logged out" });
};

export const updateProfile = async (req, res) => {
  const { firstName, lastName, email, phone, userId } = req.body;
  try {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email,
        phone,
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        photo: {
          where: { enabled: true },
        },
      },
    });

    updatedUser.password = undefined;
    updatedUser.photo = updatedUser?.photo?.[0] || null;
    updatedUser.authPermissions = updatedUser.role.permissions.map(
      (rolePermission) => rolePermission.permission.name
    );

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfileImage = async (req, res) => {
  const { user } = req;
  const { profileImage } = req;
  try {
    if (!profileImage) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }
    const currentUserImage = await db.userImage.findFirst({
      where: { userId: user.id, enabled: true },
    });

    await db.userImage.create({
      data: {
        url: profileImage.url,
        thumbnail: profileImage.thumbnail,
        type: profileImage.type,
        metadata: profileImage.metadata,
        enabled: true,
        userId: user.id,
      },
    });
    if (currentUserImage) {
      await db.userImage.update({
        where: { id: currentUserImage.id },
        data: { enabled: false },
      });
    }

    const updatedUser = await db.user.findUnique({
      where: { id: user.id },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        photo: {
          where: { enabled: true },
        },
      },
    });

    updatedUser.password = undefined;
    updatedUser.photo = updatedUser?.photo?.[0] || null;
    updatedUser.authPermissions = updatedUser.role.permissions.map(
      (rolePermission) => rolePermission.permission.name
    );

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePassword = async (req, res) => {
  const { user } = req;
  const { currentPassword, newPassword } = req.body;
  try {
    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      res.status(400).json({ message: "Contraseña actual invalida" });
      return;
    }

    const isMatch = await bcrypt.compare(newPassword, user.password);

    if (isMatch) {
      res.status(400).json({
        message: "La contraseña actual no puede ser la misma que la anterior.",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        photo: {
          where: { enabled: true },
        },
      },
    });

    updatedUser.password = undefined;
    updatedUser.photo = updatedUser?.photo?.[0] || null;
    updatedUser.authPermissions = updatedUser.role.permissions.map(
      (rolePermission) => rolePermission.permission.name
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
