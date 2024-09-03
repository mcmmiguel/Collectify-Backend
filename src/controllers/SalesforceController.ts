import { Request, Response } from 'express';
import axios from 'axios';

class SalesforceController {

    private static accessToken: string | null = null;
    private static accessTokenExpiry: number | null = null;

    static getSalesforceAccessToken = async (req: Request, res: Response) => {
        try {
            const url = `${process.env.SALESFORCE_MY_DOMAIN}/services/oauth2/token`;
            const response = await axios.post(url, new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: process.env.SALESFORCE_CLIENT_ID,
                client_secret: process.env.SALESFORCE_CLIENT_SECRET
            }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }

            );

            SalesforceController.accessToken = response.data.access_token;
            SalesforceController.accessTokenExpiry = Date.now() + response.data.expires_in * 1000;

            console.log(SalesforceController.accessToken);

            res.json({ accessToken: SalesforceController.accessToken });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }

    private static async ensureAccessToken(req: Request, res: Response) {
        if (!SalesforceController.accessToken || (SalesforceController.accessTokenExpiry && Date.now() > SalesforceController.accessTokenExpiry)) {
            await SalesforceController.getSalesforceAccessToken(req, res);
        }
    }

    static createAccountWithContact = async (req: Request, res: Response) => {

        const { firstName, lastName, email, phone } = req.body;

        try {

            await SalesforceController.ensureAccessToken(req, res);

            if (!SalesforceController.accessToken) {
                return res.status(401).json({ error: 'Access token is required' });
            }

            const accountUrl = `${process.env.SALESFORCE_MY_DOMAIN}/services/data/v61.0/sobjects/Account/`;

            const accountData = {
                Name: `${firstName} ${lastName}`,
            };

            const accountResponse = await axios.post(accountUrl, accountData, {
                headers: {
                    'Authorization': `Bearer ${SalesforceController.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const accountId = accountResponse.data.id;

            const contactUrl = `${process.env.SALESFORCE_MY_DOMAIN}/services/data/v61.0/sobjects/Contact/`;
            const contactData = {
                FirstName: firstName,
                LastName: lastName,
                Email: email,
                Phone: phone,
                AccountId: accountId
            };

            await axios.post(contactUrl, contactData, {
                headers: {
                    'Authorization': `Bearer ${SalesforceController.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            res.send('Account and Contact created successfully');

        } catch (error) {
            console.error('Error creating account or contact:', error.response ? error.response.data : error.message);
            res.status(500).json({ error: error.message });
        }
    };

}

export default SalesforceController;