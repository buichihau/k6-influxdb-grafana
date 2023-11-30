import{ sleep } from 'k6';
import http from 'k6/http';

export let options = {
    duration : '15s',
    vus : 50,
};

export default function() {
    http.get('https://admin-mytel.omicrm.services/');
    sleep(1);
}