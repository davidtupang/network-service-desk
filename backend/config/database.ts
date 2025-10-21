import { DataSource } from "typeorm";
import { User } from "../modules/users/user.entity";
import { Ticket } from "../modules/tickets/ticket.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "postgres",
  database: process.env.DB_NAME || "network_service_desk",
  entities: [User, Ticket],
  synchronize: true,
  logging: false,
});
