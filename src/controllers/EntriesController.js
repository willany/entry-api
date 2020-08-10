const db = require("../database/connections");

class EntryController {
  async create(request, response) {
    const { entries, userId } = request.body;

    const transaction = await db.transaction();

    try {
      const insertEntries = entries.map((entry) => ({
        user_id: userId,
        date: entry.date,
        start_hour: entry.startHour,
        start_lunch_break: entry.startLunchBreak,
        end_lunch_break: entry.endLunchBreak,
        end_hour: entry.endHour,
      }));

      const days = entries[0].date.split("/");

      await transaction("entries")
        .where("user_id", userId)
        .andWhere("date", "like", `%${days[1]}/${days[2]}`)
        .del();

      await transaction("entries").insert(insertEntries);

      await transaction.commit();

      return response.status(201).send();
    } catch (error) {
      transaction.rollback();

      console.log(error);
      return response.status(400).json({
        error: "Unexpeted error while creating entry",
      });
    }
  }
  async show(request, response) {
    const { user_id, month_and_year } = request.query;
    const entries = await db("entries")
      .where("user_id", user_id)
      .andWhere("date", "like", `%${month_and_year}`)
      .select([
        "entries.id",
        "entries.date",
        "entries.start_hour as startHour",
        "entries.start_lunch_break as startLunchBreak",
        "entries.end_lunch_break as endLunchBreak",
        "entries.end_hour as endHour",
        "entries.user_id as userId",
      ]);
    return response.json({ entries });
  }
}

module.exports = new EntryController();
