import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt} from "passport-jwt";
import { userModel } from "../models/user.model";
import { JWT_TOKEN_SECRET } from "../utils/jwt";


export function initializePassport() {
    passport.use('register',
        new LocalStrategy({
            usernameField:'email',
            passReqToCallback:true,
        },async(req, email, password, done) =>{
            const {firstName, lastName, age, password } = req.body;
            if (!email || !password || !firstName || !lastName || !age) {
                return done(null, false, {message: 'All fields are required'})
            }
            try {
                const user = await userModel.create({email, password, first_name: firstName, last_name:lastName, age})
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
        )
    );





    passport.use(
        'jwt',
        new JWTStrategy({
            secretOrKey: JWT_TOKEN_SECRET,
            jwtFromRequest:ExtractJwt.fromExtractors([cookieExtractor])
        })
    )

    function cookieExtractor(req) {
        let token=null;
        if (req && req.cookies){
            token = req.cookies.token;
        }
        console.log('cookieExtractor', token);
        return token
    }
}