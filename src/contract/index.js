import when from './../when/index'

export default (__rehearseInvocationHere__, options) => {
  return when(__rehearseInvocationHere__, Object.assign({}, options, { ensureContract: true }))
}
