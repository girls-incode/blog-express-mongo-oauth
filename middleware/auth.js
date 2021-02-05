export function useAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/')
    }
}

export function useGuest(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard')
    } else {
        return next()
    }
}