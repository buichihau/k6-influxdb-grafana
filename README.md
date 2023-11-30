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

| Tên trường           | Mô tả                                                                  |
| -------------------- | ---------------------------------------------------------------------- |
| `vus`                | Số lượng active users.                                                |
| `vus_max`            | Số lượng VU tối đa.                                                    |
| `iterations`         | Tổng số lần VUs thực thi default function.                            |
| `iteration_duration` | Thời gian cần thiết để thực hiện 1 lần thực thi default function.    |
| `data_received`      | Lượng data nhận về.                                                   |
| `data_sent`          | Lượng data gửi đi.                                                    |
| `checks`             | Tỉ lệ check thành công.                                               |



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

# 1 số options thông dụng

Để mô tả kịch bản test với số lượng VU là 10, duration 30s, ta có 2 cách làm như sau

Cách 1: Chạy dòng lệnh
```
k6 run --vus 10 --duration 30s script.js
```
Cách 2: Thêm các options vào file .js rồi chạy với câu lệnh run
```
export let options = {
    duration : '15s',
    vus : 50,
};
```

Rất rõ ràng, cách làm 2 giúp ta dễ dàng kiểm soát và thay đổi linh hoạt các options hơn. Ngoài VUs và duration, k6 còn cung cấp rất nhiều options khác hỗ trợ quá trình kiểm thử.

# Thresholds
Các tiêu chí dùng để xác định hiệu suất kỳ vọng của hệ thống được test.
```
thresholds: {
        http_req_failed: ['rate<0.01'], // tỉ lệ lỗi cần nhỏ hơn 1%
        http_req_duration: ['p(95)<800'], // 95% requests có tổng thời gian xử lý nhỏ hơn 800ms
      }
```
Nếu các tiêu chí đều đạt, ta có thể thấy trước các thông số http_req_failed và http_req_duration trong kết quả sẽ có tick xanh như thế này

```
checks.........................: 100.00% ✓ 406       ✗ 0
     data_received..................: 1.5 MB  49 kB/s
     data_sent......................: 198 kB  6.4 kB/s
     http_req_blocked...............: avg=5.18ms   min=0s       med=0s       max=210.95ms p(90)=0s       p(95)=0s
     http_req_connecting............: avg=858.15µs min=0s       med=0s       max=43.95ms  p(90)=0s       p(95)=0s
   ✓ http_req_duration..............: avg=237.38ms min=126.53ms med=206.94ms max=743.88ms p(90)=327.01ms p(95)=416.95ms
       { expected_response:true }...: avg=237.38ms min=126.53ms med=206.94ms max=743.88ms p(90)=327.01ms p(95)=416.95ms
   ✓ http_req_failed................: 0.00%   ✓ 0         ✗ 406
     ...

```
Trường hợp có tiêu chí không đạt, thông báo sẽ được hiển thị như sau

```
 checks.........................: 100.00% ✓ 134       ✗ 0
     data_received..................: 524 kB  49 kB/s
     data_sent......................: 70 kB   6.5 kB/s
     http_req_blocked...............: avg=13.4ms   min=0s       med=0s       max=180.37ms p(90)=0s       p(95)=179.38ms
     http_req_connecting............: avg=2.89ms   min=0s       med=0s       max=58.56ms  p(90)=0s       p(95)=31.16ms
   ✗ http_req_duration..............: avg=256.42ms min=150.03ms med=218.64ms max=817.75ms p(90)=424.47ms p(95)=530.22ms
       { expected_response:true }...: avg=256.42ms min=150.03ms med=218.64ms max=817.75ms p(90)=424.47ms p(95)=530.22ms
   ✓ http_req_failed................: 0.00%   ✓ 0         ✗ 134
     http_req_receiving.............: avg=918.51µs min=0s       med=0s       max=25.1ms   p(90)=1.32ms   p(95)=4.45ms
     ...
ERRO[0012] some thresholds have failed

```

# Stages

Trong thực tế, ứng dụng của chúng ta chắc chắn sẽ gặp phải các trường hợp số lượng request gọi vào server đột ngột tăng cao/giảm mạnh. Để kiểm tra khả năng đáp ứng của hệ thống trong trường hợp lượng người dùng thay đổi theo thời gian, chúng ta có thể sử dụng stages.

Ví dụ: Cấu hình dưới đây mô tả trường hợp lượng VU tăng dần từ 100 lên 400 mỗi 1 phút, sau đó đột ngột giảm xuống 0
```
export let options = {
  stages: [
    { duration: '1m', target: 100 },
    { duration: '1m', target: 200 },
    { duration: '1m', target: 300 },
    { duration: '1m', target: 400 },
    { duration: '5m', target: 0 },
  ],
};
```

# Checks
Lưu lại kết quả check (pass/fail) của respones trong khi script vẫn tiếp tục được thực thi

Ví dụ: Để kiểm tra trạng thái của response trả về có phải là 200 không, ta có thể chạy file .js chứa nội dung dưới đây

```
import { check } from 'k6';
import http from 'k6/http';
export default function () {
  let res = http.get('http://example.com/test');
  check(res, {
    'is status 200': (r) => r.status === 200,
  });
}
Kết quả trả về sẽ bao gồm tỉ lệ pass/fail như dưới đây

 ✗ Get direction response status code is 200
      ↳  91% — ✓ 94 / ✗ 9

     checks.........................: 91.26% ✓ 94        ✗ 9
     data_received..................: 533 kB 75 kB/s

```

# Tham Khảo
- https://github.com/grafana/k6.git
- https://medium.com/swlh/beautiful-load-testing-with-k6-and-docker-compose-4454edb3a2e3