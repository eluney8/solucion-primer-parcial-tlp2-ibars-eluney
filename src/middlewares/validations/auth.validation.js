// * ARCHIVO A COMPLETAR
import { body } from "express-validator";
import { UserModel, ProfileModel } from "../../models/index.js";

export const registerValidation = [
  // TODO: 1. Validar username: obligatorio, entre 3 y 20 caracteres y único (UserModel).
  body("username")
    .trim()
    .notEmpty()
    .withMessage("El username es obligatorio")
    .isLength({ min: 3, max: 20 })
    .withMessage("El username debe tener entre 3 y 20 caracteres")
    .isAlphanumeric()
    .withMessage("El username solo puede contener letras y números")
    .custom(async (username) => {
      const found = await UserModel.findOne({
        where: { username },
        paranoid: false,
      });
      if (found) throw new Error("El username ya está en uso");
      return true;
    }),
  // TODO: 2. Validar email: obligatorio, con formato válido y único.
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("El email no tiene un formato válido")
    .normalizeEmail()
    .custom(async (email) => {
      const found = await UserModel.findOne({
        where: { email },
        paranoid: false,
      });
      if (found) throw new Error("El email ya está registrado");
      return true;
    }),
  // TODO: 3. Validar password: obligatoria, con mínimo de 8 caracteres.
  body("password")
    .notEmpty()
    .withMessage("La password es obligatoria")
    .isLength({ min: 8 })
    .withMessage("La password debe tener al menos 8 caracteres")
    .matches(/[A-Z]/)
    .withMessage("La password debe tener al menos una mayúscula")
    .matches(/[a-z]/)
    .withMessage("La password debe tener al menos una minúscula")
    .matches(/\d/)
    .withMessage("La password debe tener al menos un número"),
  // TODO: 4. Validar role: opcional y limitado a los roles permitidos.
  body("role")
    .optional()
    .isIn(["developer", "administrator"])
    .withMessage("El role debe ser developer o administrator"),
  // TODO: 5. Validar profile.employee_number: obligatorio y único (ProfileModel).
  body("profile.employee_number")
    .trim()
    .notEmpty()
    .withMessage("El número de empleado es obligatorio")
    .matches(/^EMP-\d{4}$/)
    .withMessage("El número de empleado debe tener el formato EMP-0000")
    .custom(async (employee_number) => {
      const found = await ProfileModel.findOne({ where: { employee_number } });
      if (found) throw new Error("El número de empleado ya está registrado");
      return true;
    }),
  // TODO: 6. Validar profile.first_name y profile.last_name como obligatorios, y profile.phone como opcional.
  body("profile.first_name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/)
    .withMessage("El nombre solo puede contener letras"),
  body("profile.last_name")
    .trim()
    .notEmpty()
    .withMessage("El apellido es obligatorio")
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/)
    .withMessage("El apellido solo puede contener letras"),
  body("profile.phone")
    .optional({ values: "falsy" })
    .trim()
    .matches(/^\+?\d{7,15}$/)
    .withMessage("El teléfono no tiene un formato válido"),
  // ? Las unicidades requieren una validación personalizada asíncrona.
];

export const loginValidation = [
  // TODO: 7. Validar email: obligatorio y con formato válido.
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("El email no tiene un formato válido")
    .normalizeEmail(),
  // TODO: 8. Validar password: obligatoria.
  body("password")
    .notEmpty()
    .withMessage("La password es obligatoria")
    .isLength({ min: 8 })
    .withMessage("La password debe tener al menos 8 caracteres"),
];
