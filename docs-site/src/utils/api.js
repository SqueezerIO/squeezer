import axios from 'axios'
import Promise from 'bluebird'

if (process.env.GIT_BRANCH === `master`) {
  axios.defaults.baseURL = 'https://api.squeezer.io/prod'
} else {
  axios.defaults.baseURL = 'https://api.squeezer.io/dev'
}

if (typeof localStorage !== "undefined") {
  axios.defaults.headers.common['x-access-token'] = localStorage.token
}

// axios.interceptors.response.use((response) => {
//   return response;
// }, function (error) { 
//   console.log(response)
//   if (error.response.status === 401) {
//     window.location = "/token-sale/account/login/"
//   } 
// });

const apiLoginUser = (item) => {
  return new Promise((resolve, reject) => {
    axios.post('/rest/v1/token-sale/account/login', item).then((res) => {
      return resolve(res.data)
    }).catch((err) => {
      return reject(new Error(err.response.data.message))
    })
  })
}

const apiForgotPassword = (item) => {
  return new Promise((resolve, reject) => {
    axios.post('/rest/v1/token-sale/account/forgot_password', item).then((res) => {
      return resolve(res.data)
    }).catch((err) => {
      return reject(new Error(err.response.data.message))
    })
  })
}

const apiResetPassword = (item) => {
  return new Promise((resolve, reject) => {
    axios.post('/rest/v1/token-sale/account/reset_password', item).then((res) => {
      return resolve(res.data)
    }).catch((err) => {
      return reject(new Error(err.response.data.message))
    })
  })
}

const apiRegisterUser = (item) => {
  return new Promise((resolve, reject) => {
    axios.post('/rest/v1/token-sale/account/register', item).then((res) => {
      return resolve(res.data)
    }).catch((err) => {
      return reject(new Error(err.response.data.message))
    })
  })
}

const apiGetSummary = () => {
  return new Promise((resolve, reject) => {
    axios.get('/rest/v1/token-sale/summary').then((res) => {
      return resolve(res.data)
    }).catch((err) => {
      return reject(new Error(err.response.data.message))
    })
  })
}

const apiGetAccountDetails = () => {
  return new Promise((resolve, reject) => {
    axios.get('/rest/v1/token-sale/account/details').then((res) => {
      return resolve(res.data)
    }).catch((err) => {
      return reject(new Error(err.response.data.message))
    })
  })
}

const apiAddNewTokenSalePurchase = (item) => {
  return new Promise((resolve, reject) => {
    axios.post('/rest/v1/token-sale/purchase/new', item).then((res) => {
      return resolve(res.data)
    }).catch((err) => {
      return reject(new Error(err.response.data.message))
    })
  })
}

const apiAddNewReferral = (item) => {
  console.log(item)
  return new Promise((resolve, reject) => {
    axios.post('/rest/v1/token-sale/affiliate/referral/new', item).then((res) => {
      return resolve(res.data)
    }).catch((err) => {
      return reject(new Error(err.response.data.message))
    })
  })
}

const apiGetSecurityCode = (phone) => {
  return new Promise((resolve, reject) => {
    axios.post('/rest/v1/security/code', { phone: phone })
      .then((res) => {
        return resolve(res.data)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

const apiGetTokenSaleWhitelisted = (email) => {
  return new Promise((resolve, reject) => {
    axios.get(`/rest/v1/token-sale/whitelisted?email=${email}`).then((res) => {
      return resolve(res.data)
    }).catch((err) => {
      return reject(new Error(err.response.data.message))
    })
  })
}

export default {
  apiGetSummary,
  apiResetPassword,
  apiForgotPassword,
  apiGetAccountDetails,
  apiAddNewTokenSalePurchase,
  apiGetTokenSaleWhitelisted,
  apiGetSecurityCode,
  apiAddNewReferral,
  apiLoginUser,
  apiRegisterUser
}