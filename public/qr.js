var QRCode = require("qrcode");
var canvas = document.getElementById("canvas");
var uuid = require("uuid");
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
var valid = false;
const current_uuid = uuid.v4();
const encoded = encodeURIComponent(`https://pickin-qa.phloxcorp.io/register-pc?id=${current_uuid}`)
const qrtext = `https://pickinqa.page.link/?link=${encoded}&apn=io.phloxcorp.pickin.qa&isi=1584901781&ibi=co.phlox.pickinQA`

const client = new ApolloClient({
  uri: "https://whipped-api.phloxcorp.io:446/",
  cache: new InMemoryCache(),
});

QRCode.toCanvas(canvas, qrtext, function (error) {
  if (error) console.error(error);
  console.log("success!");
});

function checkValid() {
  chrome.storage.local.get('token', (result) => {
    if (result?.token) {
      clearInterval(timer);
      alert("인증되었습니다!")
    } else {
      client
        .mutate({
          mutation: gql`
        mutation{
        authenticateQRCode(input:{qrCodeType:CHROME_EXTENSION_LOGIN_REQUEST,key:"${current_uuid}"}) {
            token
        }
        }
        `,
          errorPolicy: "all",
        })
        .then(result => {
          chrome.storage.local.set({ token: result.data.authenticateQRCode.token });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

const timer = setInterval(checkValid, 3000);