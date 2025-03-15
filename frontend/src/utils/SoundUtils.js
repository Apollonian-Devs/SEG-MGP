import notificationSound from '../assets/notificationSound.mov';


export function playSound() {
    new Audio(notificationSound).play();

}
