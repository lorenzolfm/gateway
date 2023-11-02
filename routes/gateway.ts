import { CashuMint, CashuWallet, getEncodedToken } from '@cashu/cashu-ts';
import { Request, Router } from "express";
import { createInvoice, pay } from "lightning";
import { lnd } from "../lnd";
import { env } from '../env';
import { createDBConnection } from '../db';
import { wallet } from '../mint';

const router = Router();

router.get('/', async (_, res) => {
    return res.status(200).send('funds are safu');
});

interface RequestInvoice extends Request {
    body: {
        amount: number;
    }
}

router.post('/request_invoice', async (req: RequestInvoice, res) => {
    try {
        const invoice = await createInvoice({ lnd, tokens: req.body.amount });
        const payreq = invoice.request;

        return res.send({ payreq });
    } catch (err) {
        return res.status(500).send(err);
    }
});

interface PayInvoice extends Request {
    body: {
        invoice: string;
    }
}

router.post('/pay_invoice', async (req: PayInvoice, res) => {
    try {
        const invoice = req.body.invoice;

        const result = await pay({ lnd, request: invoice });

        return res.send(result.secret);
    } catch (err) {
        return res.status(500).send(err);
    }
});

interface RequestPix extends Request {
    body: {
        amount: number;
    }
}

router.post('/request_pix', async (req: RequestPix, res) => {
    try {
        // TODO: implement pix
    } catch (err) {
        return res.status(500).send(err);
    }
});

interface PayPix extends Request {
    body: {
        invoice: string;
    }
}

router.post('/pay_pix', async (req: PayPix, res) => {
    try {
        // TODO: implement pix
    } catch (err) {
        return res.status(500).send(err);
    }
});

/// Cashu

interface RedeemToken extends Request {
    body: {
        token: string;
    }
}

router.post('/redeem_token', async (req: RedeemToken, res) => {
    try {
        // TODO: implement redeem token
    } catch (err) {
        return res.status(500).send(err);
    }
});

interface IssueToken extends Request {
    body: {
        amount: number;
    }
}

router.post('/issue_token', async (req: IssueToken, res) => {
    try {

    } catch (err) {
        return res.status(500).send(err);
    }
});

interface CreateWallet extends Request {
    body: {
        userId: number;
    }
}

router.post('/create_wallet', async (req: CreateWallet, res) => {
    try {
        const userId = req.body.userId;

        //const wallet = new CashuWallet(new CashuMint(env.MINT_URL));

        return res.send(200);
    } catch (err) {
        return res.status(500).send(err);
    }
});

interface Fund extends Request {
    body: {
        amount: number;
    }
}

router.post('/fund', async (req: Fund, res) => {
    try {
        const amount = req.body.amount;
        const { pr, hash } = await wallet.requestMint(amount);

        await pay({ lnd, request: pr });

        const { proofs, newKeys } = await wallet.requestTokens(amount, hash);

        const encoded = getEncodedToken({ token: [{ mint: env.MINT_URL, proofs }] });

        console.log(encoded);

        return res.send(200);
    } catch (err) {
        return res.status(500).send(err);
    }
});

interface Register extends Request {
    body: {
        email: string;
    }
}

router.post('/login_or_register', async (req: Register, res) => {
    try {
        const conn = createDBConnection();
        const email = req.body.email;

        conn.each(`SELECT id FROM users WHERE email = ?`, [email], (err, row: { id: number }[]) => {
            if (err) {
                console.log(err);
            }

            if (row.length == 0) {
                conn.run(`INSERT INTO users (email) VALUES (?)`, [email], (err) => {
                    if (err) {
                        console.log(err);
                    }
                });

                return;
            }
        });

        return res.status(200).send('ok');

    } catch (err) {
        return res.status(500).send(err);
    }
});

export const gateway = router;
