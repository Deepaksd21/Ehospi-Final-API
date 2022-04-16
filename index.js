const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const allRoutes = require("./routes/route");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger/swagger.json");
const app = express();
app.use(cors());
app.use(express.json());
app.use(allRoutes);
async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://userProfiles:MoBohTt3PGtlsyCy@cluster0.nx0ry.mongodb.net/eHospiDatabase?retryWrites=true&w=majority"
    );
    console.log("Database connected sucessfully");
  } catch (error) {
    console.log(error);
  }
}
main();

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(3000, () => console.log(`Server listening on port 3000`));
