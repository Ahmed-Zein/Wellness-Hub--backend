const logger = require("../src/common/logger");

const ddos = async () => {
  const url = "https://wellnesshub.onrender.com/";
  const res = await fetch(url);
  if (res.status >= 400) {
    logger.error(res.status);
  } else {
    logger.info(res.status);
  }
};

for (let i = 0; i < 101; i++) {
  ddos();
}
