const getProducts = async () => {
  const req = await fetch("https://shop-api.toyseller.site/api/products");
  const res = await req.json();

  return res.data;
};

const getUser = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const req = await fetch("https://shop-api.toyseller.site/api/user/get/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: "WebApp",
    },
    body: JSON.stringify({
      tgUserData: user,
    }),
  });
  const res = await req.json();

  return res.data;
};

const newOrder = async (data) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const req = await fetch("https://shop-api.toyseller.site/api/order/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: "WebApp",
    },
    body: JSON.stringify({
      tgUserData: user,
      ...data,
    }),
  });
  const res = await req.json();

  return res;
};

const payTBank = async (orderID) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const req = await fetch(
    `https://shop-api.toyseller.site/api/payment/tbank/init/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "WebApp",
      },
      body: JSON.stringify({
        tgUserData: user,
        orderID: orderID,
      }),
    }
  );
  const res = await req.json();

  return res;
};

export { getProducts, newOrder, payTBank, getUser };
