const config = {
  mongoUrl:
    "mongodb+srv://ahmedzein3652:Ddsl2HuuFYVINK4d@cluster0.aicunll.mongodb.net/?retryWrites=true&w=majority",
};

module.exports = config;
// Ddsl2HuuFYVINK4d;
// mongodb+srv://ahmedzein3652:Ddsl2HuuFYVINK4d@cluster0.aicunll.mongodb.net/
mongoose.connect(process.env.mongoUri).then((result) => {
  app.listen(3000, () => {
    console.log(">> server started");
  });
});
