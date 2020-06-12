<template>
  <div id="login">
    <GoogleLogin
      :params="params"
      :renderParams="renderParams"
      :onSuccess="onSuccess"
      :onFailure="onFailure"
    ></GoogleLogin>
  </div>
</template>


<script>
import axios from "axios";
import GoogleLogin from "vue-google-login";
import { LoaderPlugin } from "vue-google-login";
export default {
  components: {
    GoogleLogin
  },
  data() {
    return {
      user_mail: "",
      user_token: "",
      employee: [],
      email: [],
      name: "",
      // client_id is the only required property but you can add several more params, full list down bellow on the Auth api section
      params: {
        client_id:
          "307443028991-v8rp8bh3gq6a6145ncn8f7s2vrqd3cbi.apps.googleusercontent.com"
      },
      // only needed if you want to render the button with the google ui
      renderParams: {
        width: 250,
        height: 50,
        longtitle: true
      },
      onSuccess: function(googleUser) {
        const profile = googleUser.getBasicProfile();
        const Token = googleUser.getAuthResponse().id_token;
        this.user_token = Token;
        this.user_mail = profile.getEmail();
        this.name = profile.getName();

        const filter = {
          params: {
            sAppID: "3F017BBB-3736-4BD6-BE7F-5F75F2200DB2",
            gtoken: this.user_token
          }
        };

        if (this.user_mail.includes("adapterdigital.com")) {
          axios
            .get(
              `//apps.adapterdigital.com/AvalonX/api/TokenIssuser.aspx`,
              filter
            )
            .then(({ data }) => {
              if (data.result == "complete") {
                localStorage.setItem("UserLogIn", this.user_mail);
                localStorage.setItem("UserLoginName", this.name);

                var apitoken = data.token;

                const filterPermission = {
                  params: {
                    apitoken: data.token,
                    appid: "3F017BBB-3736-4BD6-BE7F-5F75F2200DB2"
                  }
                };

                axios
                  .get(
                    `https://apps.adapterdigital.com/AvalonX/api/GetEmpInfo.aspx`,
                    filterPermission
                  )
                  .then(({ data }) => {
                    if (data.result == "complete") {
                      localStorage.setItem("DepGroup", data.depgroup);
                      console.log(data);
                    } else {
                      alert("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง");
                    }
                  })
                  .catch(error => {
                    if (error.response) {
                      if (error.response.status == "403") {
                        alert("fail");
                      }
                    }
                  });

                axios
                  .get(
                    `//apps.adapterdigital.com/AvalonX/api/CheckEmpPermission.aspx`,
                    filterPermission
                  )
                  .then(({ data }) => {
                    if (data.result == "complete" && data.scope == "user") {
                      localStorage.setItem("UserToken", apitoken);
                      location.reload();
                    } else if (
                      data.result == "error" &&
                      data.detail == "no_permission"
                    ) {
                      alert("ไม่มีสิทธิ์เข้าใช้งานระบบนี้");
                    } else {
                      alert("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง");
                    }
                  })
                  .catch(error => {
                    if (error.response) {
                      if (error.response.status == "403") {
                        alert("fail");
                      }
                    }
                  });
              } else {
                alert("ข้อมูลไม่ถูกต้อง กรุณาติดต่อ ผู้ดูแลระบบ");
              }
            });
        } else {
          alert("กรุณาใช้อีเมล adapter เข้าสู่ระบบ");
        }
      },
      onFailure: function() {
        //onFailure
      }
    };
  },
  methods: {
    GetRefreshToken() {
      const filter = {
        params: {
          sAppID: "DB40EE22-287D-42D6-B6B8-43A73193D587",
          id_token: this.user_token
        }
      };

      if (this.user_mail.includes("adapterdigital.co")) {
        axios
          .get(`${this.$store.state.apiEmployee}authen`, filter)
          .then(({ data }) => {
            const { error, access_token, refresh_token } = data;

            if (access_token) {
              // sessionStorage.UserLogIn = this.user_mail;
              // sessionStorage.UserToken = this.user_token;
              // sessionStorage.UserTokenEmployee = access_token;
              // sessionStorage.UserLoginName = this.name;

              localStorage.setItem("UserLogIn", this.user_mail);
              localStorage.setItem("UserToken", this.user_token);
              localStorage.setItem("UserTokenEmployee", access_token);
              localStorage.setItem("UserLoginName", this.name);

              this.GetEmplayeeActive();
            } else {
              alert("ข้อมูลไม่ถูกต้อง กรุณาติดต่อ ผู้ดูแลระบบ");
            }
          })
          .catch(error => {
            if (error.response) {
              if (error.response.status == "403") {
                alert("fail");
              }
            }
          });
      } else {
        alert("Please use adapterdigital's email to login.");
      }
    },
    CheckEmpPermission(UserToken) {
      console.log(UserToken);
      const filterPermission = {
        params: {
          gtoken: this.user_token
        }
      };

      axios
        .get(
          `apps.adapterdigital.com/AvalonX/api/CheckEmpPermission.aspx`,
          filterPermission
        )
        .then(({ data }) => {
          // console.log(data);
        })
        .catch(error => {
          if (error.response) {
            if (error.response.status == "403") {
              alert("fail");
            }
          }
        });

      // sessionStorage.UserToken = String(data.token);
    },
    GetEmplayeeActive() {
      const Header = {
        headers: {
          // localStorage.setItem("UserTokenEmployee", access_token);
          // access_token: sessionStorage.UserTokenEmployee
          access_token: localStorage.getItem("UserTokenEmployee")
        }
      };

      axios
        .get(`${this.$store.state.apiEmployee}hr/employee/active`, Header)
        .then(({ data }) => {
          this.employee = data;
          var n = data.length;
          var emailList = [];
          for (var i = 0; i < data.length; i++) {
            var email = data[i].sEmail;
            emailList.push(email);
          }
          // sessionStorage.EmployeeEmailActive = JSON.stringify(emailList);
          localStorage.setItem(
            "EmployeeEmailActive",
            JSON.stringify(emailList)
          );
          localStorage.getItem("EmployeeEmailActive");
          this.employee = localStorage.getItem("EmployeeEmailActive");
          // this.$router.push("RateCard");
          console.log("dsdsd");
        })
        .catch(error => {
          if (error.response) {
            if (error.response.status == "403") {
              alert("fail");
            }
          }
        });
    }
  },
  mounted() {}
};
</script>