import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
export default function auth(){
	const store = useStore()
  const router = useRouter()
	const register = async(values) => {
    store.dispatch('removeEmailError')
    store.dispatch('removePhoneError')
    store.dispatch('removeImageError')
    store.dispatch('removePasswordError')
    store.dispatch('setLoading')
    try{
      let response = await axios.post('/api/register', values, {headers: {'Content-Type':'multipart/form-data'}})
      store.dispatch('setToken', response.data.token)
      store.dispatch('setType', response.data.type)
      router.push({name: 'verifyEmail'})
    }
    catch(error){
      if(error.response.status === 422){
        if(error.response.data.errors.email !== undefined){
          store.dispatch('setEmailError', error.response.data.errors.email[0])
        }
        if(error.response.data.errors.phone !== undefined){
          store.dispatch('setPhoneError', error.response.data.errors.phone[0])
        }
        if(error.response.data.errors.image !== undefined){
          store.dispatch('setImageError', error.response.data.errors.image[0])
        }
        if(error.response.data.errors.password !== undefined){
          store.dispatch('setPasswordError', error.response.data.errors.password[0])
        }
      }
    }
    finally{
      store.dispatch('removeLoading')
    }
	}
  const verify = async(url) => {
    try{
      let response = await axios.post('/api/email/verify/' + url.value.id + '/' + url.value.hash + '?expires=' + url.value.expires + '&signature=' + url.value.signature)
      store.dispatch('setVerified', 1)
      if(response.data.type === 'Admin'){
        router.push({name: 'adminDashboard'})
      }
      else if(response.data.type === 'User'){
        router.push({name: 'userDashboard'})
      }
      else if(response.data.type === 'Pro'){
        router.push({name: 'userDashboard'})
      }
    }
    catch(error){
      if(error.response.status === 403){
        router.push({name: 'verifyEmail'})
        toastr.error('Your request is not valid')
      }
    }
  }
  const resend = async() => {
    store.dispatch('setLoading')
    try{
      let response = await axios.post('/api/email/resend')
      if(response.data.verified === true){
        store.dispatch('setVerified', 1)
        if(response.data.type === 'Admin'){
          router.push({name: 'adminDashboard'})
        }
        else if(response.data.type === 'User'){
          router.push({name: 'userDashboard'})
        }
        else if(response.data.type === 'Pro'){
          router.push({name: 'userDashboard'})
        }
      }
      else if(response.data.verified === false){
        store.dispatch('setMessage', response.data.message)
      }
    }
    catch(error){
      if(error.response.status === 401){
        store.dispatch('removeToken')
        store.dispatch('removeVerified')
        store.dispatch('removeType')
        router.push({name: 'Home'})
      }
    }
    finally{
      store.dispatch('removeLoading')
    }
  }
	const login = async(values) => {
    store.dispatch('removeCredentialsError')
    try{
      let response = await axios.post('/api/login', values)
      store.dispatch('setToken', response.data.token)
      store.dispatch('setType', response.data.type)
      if(response.data.verified === true){
        store.dispatch('setVerified', 1)
        if(response.data.type === 'Admin'){
          router.push({name: 'adminDashboard'})
        }
        else if(response.data.type === 'User'){
          router.push({name: 'userDashboard'})
        }
        else if(response.data.type === 'Pro'){
          router.push({name: 'proDashboard'})
        }
      }
      else if(response.data.verified === false){
        router.push({name: 'verifyEmail'})
      }
    }
    catch(error){
      if(error.response.status === 401){
        store.dispatch('setCredentialsError', error.response.data.credentials)
      }
    }
	}
  const facebookLogin = async() => {
    const formData = new FormData()
    formData.append('_method', 'patch')
    try{
      let response = await axios.post('/api/auth/facebook/redirect', formData)
      window.location.href = response.data.redirectUrl;
    }
    catch(error){}
  }
  const githubLogin = async() => {
    const formData = new FormData()
    formData.append('_method', 'patch')
    try{
      let response = await axios.post('/api/auth/github/redirect', formData)
      window.location.href = response.data.redirectUrl;
    }
    catch(error){}
  }
  const googleLogin = async() => {
    const formData = new FormData()
    formData.append('_method', 'patch')
    try{
      let response = await axios.post('/api/auth/google/redirect', formData)
      window.location.href = response.data.redirectUrl;
    }
    catch(error){}
  }
  const resetLink = async(values) => {
    store.dispatch('removeMessage')
    store.dispatch('removeEmailError')
    store.dispatch('setLoading')
    try{
      let response = await axios.post('/api/password/email', values)
      store.dispatch('setMessage', response.data.message)
    }
    catch(error){
      if(error.response.status === 422){
        if(error.response.data.errors.email !== undefined){
          store.dispatch('setEmailError', error.response.data.errors.email[0])
        }
      }
    }
    finally{
      store.dispatch('removeLoading')
    }
  }
  const setValue = async(url) => {
    try{
      let response = await axios.post('/api/password/reset/' + url.value.token + '?email=' + url.value.email)
      store.dispatch('setResetToken', response.data.token)
    }
    catch(error){}
  }
  const reset = async(values) => {
    store.dispatch('removeEmailError')
    store.dispatch('removePasswordError')
    try{
      let response = await axios.post('/api/password/reset/', values)
      store.dispatch('setToken', response.data.token)
      store.dispatch('setType', response.data.type)
      if(response.data.verified === true){
        store.dispatch('setVerified', 1)
        if(response.data.type === 'Admin'){
          router.push({name: 'adminDashboard'})
        }
        else if(response.data.type === 'User'){
          router.push({name: 'userDashboard'})
        }
        else if(response.data.type === 'Pro'){
          router.push({name: 'proDashboard'})
        }
      }
      else if(response.data.verified === false){
        router.push({name: 'verifyEmail'})
      }
    }
    catch(error){
      if(error.response.status === 422){
        if(error.response.data.errors.email !== undefined){
          store.dispatch('setEmailError', error.response.data.errors.email[0])
        }
        if(error.response.data.errors.password !== undefined){
          store.dispatch('setPasswordError', error.response.data.errors.password[0])
        }
      }
    }
  }
	const logout = async() => {
		try{
      let response = await axios.post('/api/logout')
      store.dispatch('removeToken')
      store.dispatch('removeVerified')
      store.dispatch('removeType')
      router.push({name: 'Home'})
    }
    catch(error){
      if(error.response.status === 401){
        store.dispatch('removeToken')
        store.dispatch('removeVerified')
        store.dispatch('removeType')
        router.push({name: 'Home'})
      }
    }
	}
	return{
		register,
    verify,
    resend,
		login,
    facebookLogin,
    githubLogin,
    googleLogin,
    resetLink,
    setValue,
    reset,
		logout
	}
}