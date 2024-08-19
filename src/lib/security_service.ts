import * as crypto from 'crypto';

let temporary_password = 'admin user';

/*crypto.randomBytes(32)*/
let key = Buffer.from('+T69LJuq3aVAOzhNaLOdruX1Snq0a+n3qmzxEV2t2fE=', 'base64');

export function getToken() {
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
	let encrypted = cipher.update(temporary_password);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function checkToken(token: string) {
	const parts = token.split(':');
	if (parts.length != 2) return false;
	try {
		const iv = Buffer.from(parts[0], 'hex');
		const encryptedTextBuffer = Buffer.from(parts[1], 'hex');
		const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
		let decrypted = decipher.update(encryptedTextBuffer);
		decrypted = Buffer.concat([decrypted, decipher.final()]);
		return decrypted.toString() == temporary_password;
	} catch (error) {
		return false;
	}
}
