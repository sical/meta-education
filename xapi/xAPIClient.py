import requests
import json

class xAPIClient():

    def __init__(self, *args, **kwargs):
        self.username = kwargs["username"]
        self.password = kwargs["password"]
        self.endpoint = kwargs["endpoint"]

    def _send_request(self, q):

        url = self.endpoint + "statements"

        # headers
        headers = {"X-Experience-API-Version": "1.0.0"}
        r = requests.get(url, headers=headers, params=q, auth=(self.username, self.password))
        if r.status_code <= 200 or r.status_code >= 205:
            res = json.loads(r.text)
            if res["success"] and (res["code"] <= 200 or res["code"] >= 205):
                return res
            else :
                raise ValueError("API Error %s : %s"%(res["code"], res["message"]))
            return
        else:
            raise ValueError("API Error %s : statements could not be queried"%sr.status_code)


    def get_statements(self, q):
        return self._send_request(q)
