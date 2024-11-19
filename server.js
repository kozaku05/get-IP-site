const fs = require("fs");
const express = require("express");
const app = express();
const port = 80;
app.use(express.json());
app.get("/", (req, res) => {
  res.sendFile(__dirname + `/public/index.html`);
});
app.get("/get/:password", (req, res) => {
  let password = req.params.password;
  fs.readFile("ip.json", (err, data) => {
    if (err) console.log(err);
    let json = JSON.parse(data);
    if (json.hasOwnProperty(password)) {
      json[password] += req.ip;
      fs.writeFileSync("ip.json", JSON.stringify(json, null, 2), "utf8");
      res.send("取得完了");
    } else {
      res.send("エラー");
    }
  });
});
app.get("/result/:password", (req, res) => {
  const password = req.params.password;
  fs.readFile("ip.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("サーバーエラーが発生しました");
    const json = JSON.parse(data);
    if (json.hasOwnProperty(password)) {
      if (json[password]) {
        res.send(
          `<body><h1>取得したIPアドレス: ${json[password]}, 設定したパスワード: ${password}</h1></body><style>body{background:black;color:green;}</style>`
        );
      } else {
        res.send(
          "エラー：まだ相手がURLを開いていません。または取得に失敗しています"
        );
      }
    } else {
      res.send("エラー: このURLは存在しません");
    }
  });
});
app.post("/password", (req, res) => {
  let password = req.body.password;
  console.log(req.body.password);
  const data = fs.readFileSync("ip.json", "utf8");
  let json = {};
  if (data) json = JSON.parse(data);
  json[password] = "";
  fs.writeFileSync("ip.json", JSON.stringify(json, null, 2), "utf8");
});
app.listen(port, () => {
  console.log("port" + port);
});
