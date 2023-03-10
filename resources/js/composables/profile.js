import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
export default function profile(){
	const store = useStore()
	const router = useRouter()
	const authUser = async() => {
		try{
      let response = await axios.get('/api/user')
      store.dispatch('setUser', response.data)
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
	const changeEmail = async(values, type_profile) => {
		const formData = new FormData()
		if(values.current_password === undefined){
			formData.append('current_password', '')
		}
		else{
			formData.append('current_password', values.current_password)
		}
    if(values.email === undefined){
    	formData.append('email', '')
    }
    else{
    	formData.append('email', values.email)
    }
    formData.append('_method', 'patch')
    store.dispatch('removeEmailError')
    try{
      let response = await axios.post('/api/' + type_profile + '/update-email', formData)
      if(response.data.type === 'Admin'){
        router.push({name: 'adminProfile'})
      }
      else if(response.data.type === 'User'){
        router.push({name: 'userProfile'})
      }
      else if(response.data.type === 'Pro'){
        router.push({name: 'proProfile'})
      }
      toastr.success(response.data.message)
    }
    catch(error){
    	if(error.response.status === 422){
        if(error.response.data.errors.email !== undefined){
          store.dispatch('setEmailError', error.response.data.errors.email[0])
        }
      }
      else if(error.response.status === 403){
      	toastr.error(error.response.data.message)
      }
      else if(error.response.status === 401){
      	store.dispatch('removeToken')
        store.dispatch('removeVerified')
        store.dispatch('removeType')
        router.push({name: 'Home'})
      }
    }
	}
  const changePassword = async(values, type_profile) => {
    const formData = new FormData()
    if(values.current_password === undefined){
      formData.append('current_password', '')
    }
    else{
      formData.append('current_password', values.current_password)
    }
    if(values.password === undefined){
      formData.append('password', '')
    }
    else{
      formData.append('password', values.password)
    }
    formData.append('password_confirmation', values.password_confirmation)
    formData.append('_method', 'patch')
    store.dispatch('removePasswordError')
    try{
      let response = await axios.post('/api/' + type_profile + '/update-password', formData)
      if(response.data.type === 'Admin'){
        router.push({name: 'adminProfile'})
      }
      else if(response.data.type === 'User'){
        router.push({name: 'userProfile'})
      }
      else if(response.data.type === 'Pro'){
        router.push({name: 'proProfile'})
      }
      toastr.success(response.data.message)
    }
    catch(error){
      if(error.response.status === 422){
        if(error.response.data.errors.password !== undefined){
          store.dispatch('setPasswordError', error.response.data.errors.password[0])
        }
      }
      else if(error.response.status === 403){
        toastr.error(error.response.data.message)
      }
      else if(error.response.status === 401){
        store.dispatch('removeToken')
        store.dispatch('removeVerified')
        store.dispatch('removeType')
        router.push({name: 'Home'})
      }
    }
  }
  const changePicture = async(values, type_profile) => {
    const formData = new FormData()
    if(values.image === undefined){
      formData.append('image', '')
    }
    else{
      formData.append('image', values.image)
    }
    formData.append('_method', 'patch')
    store.dispatch('removeImageError')
    try{
      let response = await axios.post('/api/' + type_profile + '/update-picture', formData, {
        headers: {'Content-Type':'multipart/form-data'},
        onUploadProgress: progressEvent => {
          store.dispatch('setProgress', (progressEvent.loaded / progressEvent.total) * 100)
        }
      })
      store.dispatch('removeProgress')
      if(response.data.type === 'Admin'){
        router.push({name: 'adminProfile'})
      }
      else if(response.data.type === 'User'){
        router.push({name: 'userProfile'})
      }
      else if(response.data.type === 'Pro'){
        router.push({name: 'proProfile'})
      }
      toastr.success(response.data.message)
    }
    catch(error){
      store.dispatch('removeProgress')
      if(error.response.status === 422){
        store.dispatch('setImageError', error.response.data.errors.image[0])
      }
      else if(error.response.status === 401){
        store.dispatch('removeToken')
        store.dispatch('removeVerified')
        store.dispatch('removeType')
        router.push({name: 'Home'})
      }
    }
  }
  const facebookConnect = async(type_profile) => {
    const formData = new FormData()
    formData.append('_method', 'patch')
    try{
      let response = await axios.post('/api/' + type_profile + '/facebook/connect', formData)
      window.location.href = response.data.redirectUrl;
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
  const facebookRemove = async(type_profile) => {
    const formData = new FormData()
    formData.append('_method', 'patch')
    try{
      let response = await axios.post('/api/' + type_profile + '/facebook/remove', formData)
      if(response.data.removed === true){
        toastr.error('Successfully removed from Facebook')
      }
      else if(response.data.removed === false){
        toastr.error('Already removed from Facebook')
      }
      store.dispatch('removeUser')
      await authUser()
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
  const githubConnect = async(type_profile) => {
    const formData = new FormData()
    formData.append('_method', 'patch')
    try{
      let response = await axios.post('/api/' + type_profile + '/github/connect', formData)
      window.location.href = response.data.redirectUrl;
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
  const githubRemove = async(type_profile) => {
    const formData = new FormData()
    formData.append('_method', 'patch')
    try{
      let response = await axios.post('/api/' + type_profile + '/github/remove', formData)
      if(response.data.removed === true){
        toastr.error('Successfully removed from GitHub')
      }
      else if(response.data.removed === false){
        toastr.error('Already removed from GitHub')
      }
      store.dispatch('removeUser')
      await authUser()
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
  const googleConnect = async(type_profile) => {
    const formData = new FormData()
    formData.append('_method', 'patch')
    try{
      let response = await axios.post('/api/' + type_profile + '/google/connect', formData)
      window.location.href = response.data.redirectUrl;
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
  const googleRemove = async(type_profile) => {
    const formData = new FormData()
    formData.append('_method', 'patch')
    try{
      let response = await axios.post('/api/' + type_profile + '/google/remove', formData)
      if(response.data.removed === true){
        toastr.error('Successfully removed from Google')
      }
      else if(response.data.removed === false){
        toastr.error('Already removed from Google')
      }
      store.dispatch('removeUser')
      await authUser()
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
		authUser,
		changeEmail,
    changePassword,
    changePicture,
    facebookConnect,
    facebookRemove,
    githubConnect,
    githubRemove,
    googleConnect,
    googleRemove
	}
}