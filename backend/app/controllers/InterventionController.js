const { Interventions } = require("../models");
const { Users } = require("../models");
const { Scales } = require("../models");
const { Op, fn, col, literal, QueryTypes, Sequelize } = require("sequelize");
const rawQueries = require("../../config/rawQueries");
const moment = require("moment");

require("moment-precise-range-plugin");
const {
  calculateRecord,
  calculateTimeLastIntervention,
} = require("../components/calculateRecord");

module.exports = {
  //#region  INDEX
  async index(req, res) {
    try {
      const interventions = await Interventions.findAll();

      return res.json(interventions);
    } catch (error) {
      console.error(error);
    }
  },
  //#endregion

  //#region STORE
  async store(req, res) {
    const { login, password, scale, observation } = req.body;

    const date_now = moment().format();

    const loginExists = await Users.findOne({
      where: { login },
    });

    if (!loginExists) {
      return res.status(403).json({
        attention: "O usuário informado não existe. Por favor verifique.",
      });
    }

    const loginFinded = await Users.findOne({
      where: {
        [Op.and]: [{ login }, { password }],
      },
    });

    if (!loginFinded) {
      return res.status(403).json({
        attention: "A senha digitada está incorreta. Tente novamente.",
      });
    }

    const scaleFinded = await Scales.findOne({
      where: {
        id: scale,
      },
    });

    if (!scaleFinded) {
      return res.status(403).json({
        attention: "Balança informada não encontrada. Verifique.",
      });
    }

    const [{ date_time_intervention }] = await rawQueries.query(
      `SELECT date_time_intervention FROM "Interventions" 
          WHERE "scaleId" = ${scale} 
        ORDER BY id DESC LIMIT 1`,
      {
        type: QueryTypes.SELECT,
      }
    );

    const date_time_last_intervention = moment
      .utc(date_time_intervention)
      .local()
      .format();

    const counttime_milliseconds = moment().diff(date_time_last_intervention);

    const { id } = await Interventions.create({
      userId: loginFinded.id,
      scaleId: scaleFinded.id,
      date_time_intervention: date_now,
      counttime_milliseconds,
      observation,
    });

    return res.json({
      id,
      success: "Intervenção registrada com sucesso.",
    });
  },

  //#endregion

  //#region SHOW
  async show(req, res) {
    const { scaleId } = req.params;

    const [{ date_time_intervention }] = await rawQueries.query(
      `SELECT date_time_intervention FROM "Interventions" 
          WHERE "scaleId" = ${scaleId} 
        ORDER BY id DESC LIMIT 1`,
      {
        type: QueryTypes.SELECT,
      }
    );

    const [{ counttime_milliseconds }] = await rawQueries.query(
      `SELECT counttime_milliseconds FROM "Interventions" 
          WHERE "scaleId" = ${scaleId} 
        ORDER BY counttime_milliseconds DESC LIMIT 1`,
      {
        type: QueryTypes.SELECT,
      }
    );

    const miliseconds_record = counttime_milliseconds;

    const date_time_last_intervention = moment
      .utc(date_time_intervention)
      .local()
      .format();

    // let diff = moment.preciseDiff(date_time_last_intervention, date_now, true);

    const milliseconds_actual_count = moment().diff(
      date_time_last_intervention
    );

    // console.log(miliseconds_record);

    // console.log(milliseconds_actual_count);

    return res.json({
      tempLastIntervention: calculateTimeLastIntervention(
        milliseconds_actual_count
      ),
      recorde:
        miliseconds_record < milliseconds_actual_count
          ? calculateRecord(milliseconds_actual_count)
          : calculateRecord(miliseconds_record),
    });
  },
  //#endregion
};
