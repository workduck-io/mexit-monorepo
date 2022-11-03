import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-male-sprites';
const generateRandomString = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const generateAvatar = () => {
    const seed = generateRandomString(Math.floor(Math.random()*10));
    let svg = createAvatar(style, {
        seed: seed,
        // ... and other options
      });
    // console.log(svg);
    return {svg , seed};
}
export default generateAvatar;