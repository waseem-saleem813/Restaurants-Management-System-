import { menuData } from "../data/menuData.js";
import { dashboardData } from "../data/dashboardData.js";

const totalOrders = document.querySelector("#total-orders");
const totalRevenue = document.querySelector("#total-revenue");
const totalCustomers = document.querySelector("#total-customers");
const totalMenuItem = document.querySelector('#total-menu-items');


totalOrders.textContent = dashboardData.totalOrders
totalRevenue.textContent = dashboardData.revenue
totalCustomers.textContent = dashboardData.totalCustomers
totalMenuItem.textContent = menuData.length
