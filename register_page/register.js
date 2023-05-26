const register_form = document.getElementById("register_form");
const loginPage_btn = document.getElementById("loginPage_btn");
const registerUser = async (userData) => {
  const response = await fetch(
    "https://todoapp-api-9mvn.onrender.com/api/user/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }
  );

  const result = await response.json();
  return result;
};

register_form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const formProps = Object.fromEntries(formData);
  const { username, email, password } = formProps;
  const userData = {
    username,
    email,
    password,
  };
  console.log(userData);
  registerUser(userData)
    .then((result) => {
      if (result.success == true) {
        console.log(result);
        window.location.replace("../login_page/login.html");
      } else {
        console.error(result);
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

loginPage_btn.addEventListener("click", () => {
  window.location.assign("../login_page/login.html");
});

function checkCookie(cookieName) {
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.indexOf(cookieName + "=") === 0) {
      return true;
    }
  }
  return false;
}

var cookieExists = checkCookie("logInAuth");
if (cookieExists) {
  window.location.assign("../app/main.html");
} else {
  console.log("The cookie does not exist.");
}
