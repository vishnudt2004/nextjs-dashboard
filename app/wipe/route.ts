import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!); // add SSL if needed

async function wipeTables() {
  const tables = ["users", "customers", "invoices", "revenue"];
  for (const table of tables) {
    await sql.unsafe(`DROP TABLE IF EXISTS ${table} CASCADE`);
  }
}

export async function GET() {
  try {
    if (process.env.NODE_ENV === "production") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    await wipeTables();

    return Response.json({ message: "Database wiped successfully" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to wipe database" }, { status: 500 });
  }
}
