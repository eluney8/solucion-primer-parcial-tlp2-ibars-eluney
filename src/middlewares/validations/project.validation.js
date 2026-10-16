// * ARCHIVO A COMPLETAR
import { body } from "express-validator";
import { Op } from "sequelize";
import {
  ProjectModel,
  TechnologyModel,
  UserModel,
} from "../../models/index.js";

const statuses = ["planning", "in_progress", "paused", "finished"];

const validateActiveLeader = async (leader_id) => {
  const user = await UserModel.findByPk(leader_id);
  if (!user) throw new Error("El leader no existe o no está activo");
  return true;
};

const validateTechnologies = async (technologies) => {
  const ids = [...new Set(technologies)];
  const found = await TechnologyModel.count({ where: { id: ids } });
  if (found !== ids.length)
    throw new Error("Una o más technologies no existen");
  return true;
};

export const createProjectValidation = [
  // TODO: 1. Validar code: obligatorio y único (ProjectModel).
  body("code")
    .trim()
    .notEmpty()
    .withMessage("El code es obligatorio")
    .matches(/^[A-Z]{3}-\d{3}$/)
    .withMessage("El code debe tener el formato AAA-000")
    .custom(async (code) => {
      const found = await ProjectModel.findOne({ where: { code } });
      if (found) throw new Error("El code ya está en uso");
      return true;
    }),
  // TODO: 2. Validar name y description como obligatorios.
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El name es obligatorio")
    .isLength({ min: 3, max: 100 })
    .withMessage("El name debe tener entre 3 y 100 caracteres"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("La description es obligatoria")
    .isLength({ min: 10, max: 500 })
    .withMessage("La description debe tener entre 10 y 500 caracteres"),
  // TODO: 3. Validar status: opcional y limitado a los estados permitidos.
  body("status")
    .optional()
    .isIn(statuses)
    .withMessage(`El status debe ser uno de: ${statuses.join(", ")}`),
  // TODO: 4. Validar start_date como fecha válida y budget como número positivo, ambos obligatorios.
  body("start_date")
    .notEmpty()
    .withMessage("La start_date es obligatoria")
    .isISO8601({ strict: true })
    .withMessage("La start_date debe ser una fecha válida (YYYY-MM-DD)"),
  body("budget")
    .notEmpty()
    .withMessage("El budget es obligatorio")
    .isFloat({ gt: 0 })
    .withMessage("El budget debe ser un número positivo"),
  // TODO: 5. Validar leader_id: debe existir y pertenecer a un usuario activo (UserModel).
  body("leader_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El leader_id debe ser un número entero")
    .bail()
    .custom(validateActiveLeader),
  // TODO: 6. Validar technologies: lista de ids que existan (TechnologyModel).
  body("technologies")
    .optional()
    .isArray()
    .withMessage("Las technologies deben ser un array de ids")
    .bail()
    .custom(validateTechnologies),
  body("technologies.*")
    .isInt({ min: 1 })
    .withMessage("Cada technology debe ser un id entero"),
  // ? Un usuario eliminado lógicamente no puede ser líder: comprobar que la búsqueda lo deje afuera.
];

export const updateProjectValidation = [
  // TODO: 7. Validar code como opcional y único, excluyendo el propio proyecto que se edita.
  body("code")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El code no puede estar vacío")
    .matches(/^[A-Z]{3}-\d{3}$/)
    .withMessage("El code debe tener el formato AAA-000")
    .custom(async (code, { req }) => {
      const found = await ProjectModel.findOne({
        where: { code, id: { [Op.ne]: req.params.id } },
      });
      if (found) throw new Error("El code ya está en uso");
      return true;
    }),
  // TODO: 8. Validar name y description como opcionales y no vacíos.
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El name no puede estar vacío")
    .isLength({ min: 3, max: 100 })
    .withMessage("El name debe tener entre 3 y 100 caracteres"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("La description no puede estar vacía")
    .isLength({ min: 10, max: 500 })
    .withMessage("La description debe tener entre 10 y 500 caracteres"),
  // TODO: 9. Validar status, start_date y budget como opcionales, con las mismas reglas que al crear.
  body("status")
    .optional()
    .isIn(statuses)
    .withMessage(`El status debe ser uno de: ${statuses.join(", ")}`),
  body("start_date")
    .optional()
    .isISO8601({ strict: true })
    .withMessage("La start_date debe ser una fecha válida (YYYY-MM-DD)"),
  body("budget")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("El budget debe ser un número positivo"),
  // TODO: 10. Validar leader_id como opcional, existente y de un usuario activo.
  body("leader_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El leader_id debe ser un número entero")
    .bail()
    .custom(validateActiveLeader),
  // TODO: 11. Validar technologies como opcional, con ids que existan.
  body("technologies")
    .optional()
    .isArray()
    .withMessage("Las technologies deben ser un array de ids")
    .bail()
    .custom(validateTechnologies),
  body("technologies.*")
    .isInt({ min: 1 })
    .withMessage("Cada technology debe ser un id entero"),
  // ? Para saber qué proyecto se edita, el id se obtiene de los parámetros de la ruta (req.params).
];
