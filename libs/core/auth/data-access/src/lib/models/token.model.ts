export interface JwtToken {
    access_token: string;
    expires_in: number;
    id_token: string;
    refresh_token: string;
    scope: string;
    token_type: string;
}

export interface TokenInfo {
    sub: string;
    oi_tkn_id: string;
    oi_au_id: string;
    iss: string;
    iat: number;
    exp: number;
    azp: string;
    aud: string;
    at_hash: string;
    username: string;
    lastname: string;
    firstname: string;
    avatar: string;
    email: string;
    code?: string;
    hoTen: string;
    UserName: string;
    HoTen: string;
    NgaySinh: string;
    CMND: string;
    Email: string;
    GioiTinh: string;
    Sdt: string;
    DiaChi: string;
    MaLop: string;
    MaNganh: string;
    jti: string;
}
