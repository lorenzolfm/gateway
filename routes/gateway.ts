import { Request, Router } from "express";
import { createInvoice, pay } from "lightning";
import { lnd } from "../lnd";

const router = Router();

router.get('/', async (_, res) => {
    return res.status(200).send('funds are safu');
});

interface RequestInvoice extends Request {
    body: {
        amount: number;
    }
}

router.get('/request-invoice', async (req: RequestInvoice, res) => {
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

router.post('/pay-invoice', async (req: PayInvoice, res) => {
    try {
        const invoice = req.body.invoice;

        const result = await pay({ lnd, request: invoice });

        return res.send(result.secret);
    } catch (err) {
        return res.status(500).send(err);
    }
});

export const gateway = router;

/*

interface RequestPix extends Request {
    body: {
        amount: number;
    }
}

router.post('/request-pix', async (req: RequestPix, res) => { });

interface PayPix extends Request {
    body: {
        invoice: string;
    }
}

router.post('/pay-pix', async (req: PayPix, res) => { });


interface RedeemToken extends Request {
    body: {
        token: string;
    }
}

router.post('/redeem-token', async (req: RedemToken, res) => { });

interface IssueToken extends Request {
    body: {
        amount: number;
    }
}

router.post('/issue-token', async (req: IssueToken, res) => { });

*/
