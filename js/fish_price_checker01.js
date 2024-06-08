//1.Save クリックイベント
$("#save").on("click", function () {
  let dateValue = $("#date").val();
  let fishValue = $("#fish").val();
  let placeValue = $("#place").val();
  let priceValue = $("#price").val();
  let remarksValue = $("#remarks").val();

  // 画像ファイルを読み込む
  let fileInput = document.getElementById("imgFile");
  // 画像ファイルが選択されているかどうかをチェック（無い場合はアラート）
  if (fileInput.files.length === 0) {
    alert("画像ファイルを選択してください。");
    return;
  }
  
  let file = fileInput.files[0];
  let reader = new FileReader();

  // 画像ファイル読み込み完了時の処理
  reader.onload = function (event) {
    let fileData = event.target.result;

    // データオブジェクトを作成
    let data = {
      date: dateValue,
      fish: fishValue,
      place: placeValue,
      price: priceValue,
      remarks: remarksValue,
      fileInput: fileData // Base64形式に変換したファイルデータを保存
    };

    // 一意のキーを生成
    let uniqueKey = Date.now();  // 現在のタイムスタンプをキーに追加

    // ローカルストレージにデータを保存
    localStorage.setItem(uniqueKey, JSON.stringify(data));

    // 保存されたデータを取得してコンソールに表示
    let result = JSON.parse(localStorage.getItem(uniqueKey));
    console.log(result);

    // リストアイテムのHTMLを作成し、リストに追加
    // const html = `
    //   <li>
    //     <p>日付: ${result.date}, 魚種: ${result.fish}, 金額: ${result.price} 円/kg, 備考: ${result.remarks}, 画像: ${result.fileInput}</p>
    //   </li>
    // `;
    // $("#list").append(html);

    // 入力フィールドをクリア
    $("#date").val("");
    $("#fish").val("");
    $("#place").val("");
    $("#price").val("");
    $("#remarks").val("");
    $("#imgFile").val(""); // ファイル選択欄もクリア
    $(".preview").css("background-image", "none"); // プレビュー画像をクリア
    window.myLine.destroy();// グラフエリアをクリア 
  };

  // ファイルをBase64に変換
  reader.readAsDataURL(file);
});

// ファイル選択欄の変更イベントに関数を結び付けて、プレビュー表示を行う
$('#imgFile').change(
  function () {
      if (!this.files.length) {
          return;
      }

      var file = $(this).prop('files')[0];
      var fr = new FileReader();
      $('.preview').css('background-image', 'none');
      fr.onload = function() {
          $('.preview').css('background-image', 'url(' + fr.result + ')');
      }
      fr.readAsDataURL(file);
  }
);

//2.入力クリア クリックイベント
$("#empty").on("click", function () {
  $("#date").val("");
  $("#fish").val(""); 
  $("#place").val("");
  $("#price").val(""); 
  $("#remarks").val(""); 
  $("#imgFile").val("");
  $(".preview").css("background-image", "none"); 
  $("#list").empty();
  window.myLine.destroy();// グラフエリアをクリア 
});

// プライスチェック クリックイベント
$("#check").on("click", function () {
  // 選択された魚
  var selectedFish = $("#fish").val();
  // 選択された魚のデータセットを取得
  var fishDataset = fishData[selectedFish];
  if (!fishDataset) {
      alert("魚を選択してください。");
      return;
  }
  
  // 入力された価格
  var priceValue = $("#price").val();
  if (!priceValue) {
      alert("価格を入力してください。");
      return;
  }
  
  // 選択された魚のデータセットと価格を比較して、結果を表示
  var message = "";
  fishDataset.forEach(function(dataset) {
      if (priceValue < dataset.data[dataset.data.length - 1]) {
          message += dataset.label + "と比べて買い！\n";
      } else {
          message += dataset.label + "と比べてうーん…\n";
      }
  });

  
  // 結果をアラートで表示
  alert(message);
});


//4.データベース削除 クリックイベント
$("#clear").on("click", function () {
  // 確認ダイアログを表示
  if (confirm("全データを削除しますか？")) {
      localStorage.clear(); // ローカルストレージをクリア
      $("#list").empty(); // リスト表示をクリア
      $("#date").val(""); // 各入力フィールドをクリア
      $("#fish").val("");
      $("#place").val("");
      $("#price").val("");
      $("#remarks").val("");
      $("#imgFile").val("");
      $(".preview").css("background-image", "none"); // 画像プレビューをクリア
      if (window.myLine) {
          window.myLine.destroy(); // グラフが存在する場合はクリア
      }
  }
});


//5.データベース表示　クリックイベント
  $("#database").on("click", function () {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      const data = JSON.parse(value); // JSON文字列をJavaScriptオブジェクトにパース
      const html = `
        <div class="grid-item">
          <img src="${data.fileInput}" alt="画像">
          <p>日付: ${data.date}<br>おさかな: ${data.fish}<br>産地: ${data.place}<br>金額: ${data.price} 円/kg<br>備考: ${data.remarks}</p>
        </div>
      `;
      $("#list").append(html);
    }
   });
 



  // ページ読み込み時の保存データ取得と表示
$(document).ready(function () {
  for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      const data = JSON.parse(value); // JSON文字列をJavaScriptオブジェクトにパース
      // const html = `
      //     <li>
      //         <p>日付: ${data.date}, 魚種: ${data.fish}, 金額: ${data.price} 円/kg, 備考: ${data.remarks}</p>
      //     </li>
      // `;
      // $("#list").append(html);
  }
});

// 魚ごとのデータセット
const fishData = {
  ハマチ: [
    {
        label: "2023年のハマチ価格",
        fillColor: "rgba(92,220,92,0.2)",
        strokeColor: "rgba(92,220,92,1)",
        pointColor: "rgba(92,220,92,1)",
        pointStrokeColor: "white",
        pointHighlightFill: "yellow",
        pointHighlightStroke: "green",
        data: [1900, 1890, 1870, 1810, 1690, 1590, 1560, 1540, 1540, 1530, 1430, 1420]
    },
    {
        label: "2024年のハマチ価格",
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "white",
        pointHighlightFill: "yellow",
        pointHighlightStroke: "blue",
        data: [1540, 1620, 1680, 1670, 1720,]
    }
],
  マグロ: [
      {
          label: "2023年のマグロ価格",
          fillColor: "rgba(92,220,92,0.2)",
          strokeColor: "rgba(92,220,92,1)",
          pointColor: "rgba(92,220,92,1)",
          pointStrokeColor: "white",
          pointHighlightFill: "yellow",
          pointHighlightStroke: "green",
          data: [4720, 4370, 4370, 4110, 3780, 3020, 3490, 4300, 4600, 4350, 4540, 4340]
      },
      {
          label: "2024年のマグロ価格",
          fillColor: "rgba(151,187,205,0.2)",
          strokeColor: "rgba(151,187,205,1)",
          pointColor: "rgba(151,187,205,1)",
          pointStrokeColor: "white",
          pointHighlightFill: "yellow",
          pointHighlightStroke: "blue",
          data: [3620, 3120, 3210, 3550, 3070,]
      }
  ],
  サバ: [
      {
          label: "2023年のサバ価格",
          fillColor: "rgba(92,220,92,0.2)",
          strokeColor: "rgba(92,220,92,1)",
          pointColor: "rgba(92,220,92,1)",
          pointStrokeColor: "white",
          pointHighlightFill: "yellow",
          pointHighlightStroke: "green",
          data: [630, 560, 580, 560, 530, 450, 500, 530, 570, 590, 570, 650]
      },
      {
          label: "2024年のサバ価格",
          fillColor: "rgba(151,187,205,0.2)",
          strokeColor: "rgba(151,187,205,1)",
          pointColor: "rgba(151,187,205,1)",
          pointStrokeColor: "white",
          pointHighlightFill: "yellow",
          pointHighlightStroke: "blue",
          data: [430, 420, 360, 410, 440]
      },

  ],
  アジ: [
      {
          label: "2023年のアジ価格",
          fillColor: "rgba(92,220,92,0.2)",
          strokeColor: "rgba(92,220,92,1)",
          pointColor: "rgba(92,220,92,1)",
          pointStrokeColor: "white",
          pointHighlightFill: "yellow",
          pointHighlightStroke: "green",
          data: [530, 510, 540, 540, 590, 670, 650, 750, 780, 580, 590, 650]
      },
      {
        label: "2024年のアジ価格",
          fillColor: "rgba(151,187,205,0.2)",
          strokeColor: "rgba(151,187,205,1)",
          pointColor: "rgba(151,187,205,1)",
          pointStrokeColor: "white",
          pointHighlightFill: "yellow",
          pointHighlightStroke: "blue",
        data: [750, 800, 710, 660, 690]
    },

  ]
};

// グラフ更新関数
function updateGraph(fish) {
  var ctx = document.getElementById("graph").getContext("2d");
  var newChartData = {
      labels: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
      datasets: []
  };

  if (fishData[fish]) {
      newChartData.datasets = fishData[fish];
  }

  if (window.myLine) {
      window.myLine.destroy(); // グラフの初期化
  }
  window.myLine = new Chart(ctx).Line(newChartData); // 新しいデータでグラフを描画
}

// 魚の選択が変更されたときのイベントハンドラ
$("#fish").change(function () {
  var selectedFish = $(this).val();
  updateGraph(selectedFish); // グラフを更新
});

// 初期グラフ表示
updateGraph($("#fish").val());
