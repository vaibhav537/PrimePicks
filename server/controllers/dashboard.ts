import { PoolClient } from "pg";
import pool from "../connection/dbConnection";
import { HELPER } from "../src/Resources";
const helper = new HELPER();
export const getDashboardData = async (req:any, res:any): Promise<void> => {
    let client:PoolClient | null = null;
  try {
    client = await pool.connect();
    const statsResult = await client.query(helper.dashboardStatsQuery);
    const revenueResult = await client.query(helper.revenueQuery);
    const revenueDataResult = await client.query(helper.revenueDataQuery);
    const recentOrdersResult = await client.query(helper.recentOrdersQuery);
    const topCategoriesResult = await client.query(helper.topCategoriesQuery);
    const monthlySalesResult = await client.query(helper.monthlySalesQuery);
    res.json({
        stats: statsResult.rows[0],
        revenue: revenueResult.rows[0],
        revenueData: revenueDataResult.rows,
        recentOrders: recentOrdersResult.rows,
        topCategories: topCategoriesResult.rows,
        monthlySales: monthlySalesResult.rows,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching data." });
  }
  finally {
  //  pool.end();
  if(client) { client.release()}
  }
};

module.exports = { getDashboardData };
