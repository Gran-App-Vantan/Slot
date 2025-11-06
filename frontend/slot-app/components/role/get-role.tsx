const role = {
    // 合計550 |　画像が決まり次第変更
    aRole: <img src="/slot-item/1762352725612.png" className="w-[140px] h-[130px] object-cover" alt="淳平No.1" />,  
    bRole: <img src="/slot-item/IMG_4021.jpg" className="w-[140px] h-[130px] object-cover" alt="淳平No.2" />,
    cRole: <img src="/slot-item/IMG_5546.jpg" className="w-[140px] h-[130px] object-cover" alt="淳平No.3" />,
    dRole: <img src="/slot-item/IMG_5964.jpg" className="w-[140px] h-[130px] object-cover" alt="淳平No.4" />,
    eRole: <img src="/slot-item/IMG_7581.jpg" className="w-[140px] h-[130px] object-cover" alt="淳平No.5" />,
    fRole: <img src="/slot-item/IMG_7721.jpg" className="w-[140px] h-[130px] object-cover" alt="淳平No.6" />,
    gRole: <img src="/slot-item/IMG_7773.jpg" className="w-[140px] h-[130px] object-cover" alt="淳平No.7" />,
    hRole: <img src="/slot-item/IMG_7778.jpg" className="w-[140px] h-[130px] object-cover" alt="淳平No.8" />,
    iRole: <img src="/slot-item/IMG_7987.jpg" className="w-[140px] h-[130px] object-cover" alt="淳平No.9" />,
    jRole: <img src="/slot-item/IMG_8797.jpg" className="w-[140px] h-[130px] object-cover" alt="淳平No.10" />,
};
const roleNumber = {
    aRole: 10,
    bRole: 20,
    cRole: 30,
    dRole: 40,
    eRole: 50,
    fRole: 60,
    gRole: 70,
    hRole: 80,
    iRole: 90,
    jRole: 100,
};

export default function GetRole():React.ReactNode {
    // 全部のロールの合計を計算し分母にする
    const totalRole = Object.values(roleNumber).reduce((acc, curr) => acc + curr, 0);
    
    // Math.floorで小数点以下を切り捨てる  | randomでRoleの中からランダムに選ぶ
    const random = Math.floor(Math.random() * totalRole);

    if (random <= 30) {
        return role.aRole;
    } else if (random <= 70) {
        return role.bRole;
    } else if (random <= 170) {
        return role.cRole;
    } else if (random <= 210) {
        return role.dRole;
    } else if (random <= 300) {
        return role.eRole;
    } else if (random <= 370) {
        return role.fRole;
    } else if (random <= 430) {
        return role.gRole;
    } else if (random <= 500) {
        return role.hRole;
    } else if (random <= 530) {
        return role.iRole;
    } else {
        return role.jRole;
    }
}
