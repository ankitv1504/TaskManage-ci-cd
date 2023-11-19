export const authValidate = (req, res, next) => {
	if (req.session.isAuthenticated) {
		next()
	} else {
		res.status(401).redirect('/signin')
	}
}
