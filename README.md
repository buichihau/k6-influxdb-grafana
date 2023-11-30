Đã bao giờ bạn code 1 API mà khi dùng postman tạo request thì thấy cũng có response. Tuy nhiên, sau khi đưa vào sử dụng thì ngày nào cũng thấy bị log lỗi do request gửi vào liên tục, dẫn đến tình trạng cao tải, thành ra tính năng thì có, nhưng gần như không dùng được chưa?

Nếu câu trả lời là rồi, thì hãy cùng mình tìm hiểu qua về performance testing nhé!

# Performance và Load Testing

Performance testing - kiểm thử hiệu năng là quá trình đánh giá chất lượng và khả năng đáp ứng của sản phẩm (hay cụ thể hơn là phần mềm của team). Có nhiều loại kiểm thử hiệu năng có thể được áp dụng trong quá trình kiểm thử phần mềm, load testing - kiểm thử tải trọng là một trong số đó. Nó giúp chúng ta đánh giá được “phản ứng” và trạng thái của phần mềm trong điều kiện thường lẫn cao tải. Từ đó, team dev có thể đánh giá và tránh được các rủi ro khi hệ thống vận hành.

Hiện tại có rất nhiều công cụ hỗ trợ kiểm thử hiệu năng như Jmeter, Grinder, LoadComplete,... Trong bài viết này, chúng ta sẽ cùng nhau tìm hiểu về k6, công cụ mà mình được sếp khai sáng

# k6 là gì

k6 là một công cụ nguồn mở và hoàn toàn miễn phí, giúp việc kiểm thử hiệu năng của các API, microservice, và các website trở nên dễ dàng hơn.

# Cài đặt k6
Mọi người có thể tham khảo cách cài đặt k6 tại đây
- https://github.com/grafana/k6.git

```
docker-compose up -d influxdb grafana
docker-compose run --rm k6 run /scripts/demo.js
```

Truy cập vào Grafana server http://localhost:3000


# HTTP Requests
2 khái niệm cơ bản bạn cần biết khi làm việc với k6 là người dùng ảo (virtual users - VUs) và duration - 1 chuỗi quy định khoảng thời gian quá trình kiểm thử diễn ra.

k6 sử dụng Javascript để chạy test. 1 kịch bản kiểm thử hiệu năng (tối thiểu) cần có 1 default function giúp VUs xác đỉnh điểm đầu vào, tương tự hàm main() ở các ngôn ngữ lập trình.

Code nằm trong default function gọi là VU code, nó sẽ được chạy hết lần này đến lần khác trong quá trình chạy test. Code nằm ngoài default là init code và chỉ được chạy 1 lần duy nhất với mỗi VU

# HTTP GET request
1 file js đơn giản dùng trong kiểm thử với k6 sẽ trông như thế này.

```
import{ sleep } from 'k6';
import http from 'k6/http';

export let options = {
    duration : '15s',
    vus : 50,
};

export default function() {
    http.get('http://test.k6.io/contacts.php');
    sleep(1);
}

```

Ở đây, quá trình test mô tả 50 người dùng truy cập vào trang https://test.k6.io trong vòng 15 giây

Để chạy test, bạn hãy:

B1: Lưu code dưới dạng file js, ví dụ "demo.js"

B2: (Mình dùng cmd) mở cmd từ folder chứa file js và chạy câu lệnh sau

```
k6 run demo.js
```

# HTTP POST request
Hãy cùng xem qua 1 ví dụ về POST request với dữ liệu truyền vào dưới dạng JSON

```
import{ sleep } from 'k6';
import http from 'k6/http';

export let options = {
    duration : '15s',
    vus : 50,
};

export default function () {
    const url = 'http://example.com/login';
    const body = JSON.stringify({
      name: 'wfng',
      age: '99',
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    http.post(url, body, params);
  }
```

# Kết quả đầu ra

Sau khi quá trình test hoàn tất thì màn hình sẽ hiển thị kết quả đầu ra như sau

<img src="https://i.imgur.com/LxPpB4f.png" />

## Chi tiết thử nghiệm:

- execution: local: thông tin về mode thực thi k6 (local hoặc cloud)
- script: path/to/script.js: tên của tệp được thực thi
- scenarios: ...: tóm tắt kịch bản thử nghiệm và 1 số thông tin tổng quan:
- Tóm tắt kết quả test*

Tên trường | Mô tả |
--- | --- |
vus | Số lượng active users. |
vus_max | Số lượng VU tối đa. |
iterations | Tổng số lần VUs thực thi default functionbiết là gói tin đã nhận được dữ liệu thành công. |
iteration_duration | Thời gian cần thiết để thực hiện 1 lần thực thi default function. |
data_received | Lượng data nhận về. |
data_received | Lượng data gửi đi. |
checks | Tỉ lệ check thành công. |


Số liệu được sinh ra khi có HTTP request

| Tên trường                  | Mô tả                                              |
| --------------------------- | --------------------------------------------------- |
| `http_reqs`                 | Tổng số HTTP requests mà k6 đã sinh ra               |
| `http_req_blocked`          | Thời gian chờ kết nối TCP                           |
| `http_req_connecting`       | Thời gian thiết lập kết nối TCP đến máy chủ         |
| `http_req_tls_handshaking`  | Thời gian máy khách và máy chủ xác nhận lẫn nhau    |
| `http_req_sending`          | Thời gian gửi dữ liệu đến máy chủ                    |
| `http_req_waiting`          | Thời gian chờ phản hồi từ máy chủ                   |
| `http_req_receiving`        | Thời gian nhận dữ liệu phản hồi từ máy chủ          |
| `http_req_duration`         | Tổng thời gian gửi request, chờ phản hồi và nhận dữ liệu phản hồi từ máy chủ |



- https://github.com/grafana/k6.git
- https://medium.com/swlh/beautiful-load-testing-with-k6-and-docker-compose-4454edb3a2e3