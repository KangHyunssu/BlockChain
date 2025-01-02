const web3 = new Web3(window.ethereum); // Ganache RPC URL 설정

// 스마트 계약 관련 설정
const contractAddress = "0x95b812f44AB24eeB1C4A199B3bD885cdcc120886";
const contractABI = []; // ABI

// MetaMask 연결 확인 함수
async function checkMetaMaskAvailability() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      return true;
    } catch (err) {
      console.error("Failed to connect to MetaMask =", err);
      return false;
    }
  } else {
    console.error("MetaMask not found ...");
    return false;
  }
}

// MetaMask 버튼 이벤트 리스너
document.getElementById("metamask").addEventListener("click", async () => {
  try {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      document.getElementById("status1").innerText = "Connected to MetaMask";
      document.getElementById("status1").style.color = "green";
      console.log("MetaMask connected.");
    } else {
      document.getElementById("status1").innerText = "MetaMask not found.";
      document.getElementById("status1").style.color = "red";
    }
  } catch (err) {
    console.error("Failed to connect to MetaMask:", err);
    document.getElementById("status1").innerText = "Failed to connect to MetaMask.";
    document.getElementById("status1").style.color = "red";
  }
});

// MetaMask 연결 함수
async function ConnectWallet() {
  try {
    // MetaMask 권한 요청
    const permissions = await window.ethereum.request({
      method: "wallet_getPermissions",
    });

    // 권한에서 연결된 계정 가져오기
    const connectedAccounts = permissions
      .filter((permission) => permission.parentCapability === "eth_accounts")
      .flatMap((permission) => permission.caveats[0].value);

    console.log("@@ All connected accounts =", connectedAccounts);

    // MetaMask 상태 업데이트
    const primaryAccount = connectedAccounts[0];
    document.getElementById("status1").innerText =
      `Connected to MetaMask (Primary Account: ${primaryAccount}) ...`;
    document.getElementById("status1").style.color = "green";

    // Account 정보 출력
    connectedAccounts.forEach((account, index) => {
      console.log(`Account ${index + 1}: ${account}`);
    });
  } catch (err) {
    console.error("Failed to connect to MetaMask =", err);
    document.getElementById("status1").innerText =
      "Failed to connect to MetaMask";
    document.getElementById("status1").style.color = "red";
  }
}

// 계정 정보 버튼 이벤트 리스너
document.getElementById("accountbutton").addEventListener("click", async () => {
  await AccountInformation();
});

// 계정 정보 함수 수정: 모든 계정 출력 추가
async function AccountInformation() {
  try {
    const accounts = await web3.eth.getAccounts(); // 모든 계정 가져오기

    // 현재 가스 가격 가져오기
    const gasPriceWei = await web3.eth.getGasPrice(); // 가스 가격 (Wei 단위)
    const gasPriceEth = web3.utils.fromWei(gasPriceWei, "ether"); // 읽기 쉬운 ETH 단위로 변환

    // 계정 정보 출력 시작
    let accountInfo = "All Accounts:\n";

    // 각 계정의 ETH 잔액, 토큰 잔액 및 가스 가격 출력
    for (const [index, account] of accounts.entries()) {
      const ethBalanceWei = await web3.eth.getBalance(account); // ETH 잔액 가져오기
      const ethBalance = web3.utils.fromWei(ethBalanceWei, "ether"); // ETH 단위 변환

      let tokenBalance = "N/A"; // 기본값
      try {
        // 스마트 계약에서 토큰 잔액 가져오기
        tokenBalance = await contract.methods.getCABalance(account).call();
      } catch (err) {
        console.error(`Failed to fetch token balance for ${account}:`, err);
      }

      // 계정 정보 추가
      accountInfo += `Account ${index + 1}: ${account}\n`;
      accountInfo += `   ETH Balance: ${ethBalance} ETH\n`;
      accountInfo += `   Token Balance: ${tokenBalance}\n`;
      accountInfo += `   Gas Price: ${gasPriceEth} ETH (per unit)\n\n`;
    }

    // 결과를 HTML에 출력
    const statusElement = document.getElementById("status2");
    statusElement.innerText = accountInfo;
    console.log("All Accounts with Balances and Gas Price:", accountInfo);
  } catch (err) {
    console.error("Failed to fetch accounts or balances:", err);
    document.getElementById("status2").innerText = "Failed to fetch account information.";
  }
}

// Show Balance 버튼 이벤트 리스너
document.getElementById("showBalanceButton").addEventListener("click", async () => {
  const address = document.getElementById("showBalanceAddress").value; // 입력된 주소 가져오기
  if (!web3.utils.isAddress(address)) {
    // 유효한 이더리움 주소인지 확인
    document.getElementById("status2").innerText = "Invalid Ethereum address.";
    document.getElementById("status2").style.color = "red";
    return;
  }

  try {
    // 이더리움 잔액 가져오기
    const balanceWei = await web3.eth.getBalance(address);
    const balanceEth = web3.utils.fromWei(balanceWei, "ether"); // ETH 단위로 변환
    document.getElementById("status2").innerText = `Balance: ${balanceEth} ETH`;
    document.getElementById("status2").style.color = "green";
    console.log(`Balance of ${address}: ${balanceEth} ETH`);
  } catch (err) {
    console.error("Failed to fetch balance:", err);
    document.getElementById("status2").innerText = "Failed to fetch balance.";
    document.getElementById("status2").style.color = "red";
  }
});

// 송금 버튼 이벤트 리스너
document.getElementById("sendButton").addEventListener("click", async () => {
  const metaMaskAvailable = await checkMetaMaskAvailability();
  if (metaMaskAvailable) {
    await SendFunction();
  }
});

// 송금 함수
async function SendFunction() {
  const from = document.getElementById("fromAddress").value; // 송금자 주소
  const to = document.getElementById("toAddress").value; // 수신자 주소
  const amount = document.getElementById("amountinput").value; // 송금 금액

  // 필수 입력값 확인
  if (!from || !to || !amount) {
    console.error("From, To, and Amount fields are required.");
    document.getElementById("status2").innerText = "All fields are required.";
    document.getElementById("status2").style.color = "red";
    return;
  }

  try {
    // 금액을 Wei 단위로 변환
    const amountWei = web3.utils.toWei(amount, "ether");

    // 송금 트랜잭션 생성
    const transaction = {
      from: from,
      to: to,
      value: amountWei,
    };

    // 트랜잭션 전송
    const result = await web3.eth.sendTransaction(transaction);

    console.log("Transaction result =", result);
    document.getElementById("status2").innerText = "Transaction sent successfully!";
    document.getElementById("status2").style.color = "yellow";
  } catch (err) {
    console.error("Failed to send transaction:", err);
    document.getElementById("status2").innerText = "Failed to send transaction.";
    document.getElementById("status2").style.color = "red";
  }
}



// NFT 발행 버튼 이벤트 리스너
document.getElementById("mintbutton").addEventListener("click", async () => {
  const metaMaskAvailable = await checkMetaMaskAvailability();
  if (metaMaskAvailable) {
    await mintNFT();
  }
});

// NFT 발행 (민트) 함수
async function mintNFT() {
  const from = document.getElementById("mintToAddress").value; // 민팅 송금자 주소
  const mintAmount = document.getElementById("mintAmount").value; // 민팅할 토큰 수량
  const etherValue = document.getElementById("mintValue").value; // 전송할 이더리움 값

  // 입력값 검증
  if (!web3.utils.isAddress(from)) {
    console.error("Valid Ethereum address is required.");
    document.getElementById("mintStatus").innerText = "Please enter a valid Ethereum address.";
    document.getElementById("mintStatus").style.color = "red";
    return;
  }

  if (!mintAmount || isNaN(mintAmount) || parseInt(mintAmount) <= 0) {
    console.error("Valid mint amount is required.");
    document.getElementById("mintStatus").innerText = "Please enter a valid mint amount.";
    document.getElementById("mintStatus").style.color = "red";
    return;
  }

  if (!etherValue || isNaN(etherValue) || parseFloat(etherValue) <= 0) {
    console.error("Valid Ether value is required.");
    document.getElementById("mintStatus").innerText = "Please enter a valid Ether value.";
    document.getElementById("mintStatus").style.color = "red";
    return;
  }

  const contract = new web3.eth.Contract(contractABI, contractAddress); // 스마트 컨트랙트 인스턴스 생성

  try {
    const valueInWei = web3.utils.toWei(etherValue, "ether"); // Ether -> Wei 변환

    // 민트 함수 호출
    const result = await contract.methods.mint(mintAmount).send({
      from: from,
      value: valueInWei,
      gas: 500000, // 가스 한도
    });

    // 성공 시 출력
    console.log("Minting successful:", result);
    document.getElementById("mintStatus").innerText = `Mint successful! Transaction Hash: ${result.transactionHash}`;
    document.getElementById("mintStatus").style.color = "green";
  } catch (err) {
    // 실패 시 출력
    console.error("Minting failed:", err);
    document.getElementById("mintStatus").innerText = `Mint failed: ${err.message}`;
    document.getElementById("mintStatus").style.color = "red";
  }
}


// Get Token Amount 버튼 이벤트 리스너
document.getElementById("getTokenAmountButton").addEventListener("click", async () => {
  const contract = new web3.eth.Contract(contractABI, contractAddress); // 스마트 컨트랙트 인스턴스 생성

  try {
    // totalSupply 호출
    const totalSupply = await contract.methods.totalSupply().call();

    // 결과 출력
    document.getElementById("tokenAmountDisplay").innerText = `Total Supply: ${totalSupply} Tokens`;
    document.getElementById("tokenAmountDisplay").style.color = "green";
    console.log("Total Supply:", totalSupply);
  } catch (err) {
    console.error("Failed to fetch total supply:", err);
    document.getElementById("tokenAmountDisplay").innerText = "Failed to fetch total supply.";
    document.getElementById("tokenAmountDisplay").style.color = "red";
  }
});

// Get CA User Balance 버튼 이벤트 리스너
document.getElementById("getCABalanceButton").addEventListener("click", async () => {
  const userAddress = document.getElementById("caBalanceAddress").value; // 입력된 사용자 주소 가져오기

  if (!web3.utils.isAddress(userAddress)) {
    // 유효한 주소인지 확인
    document.getElementById("caBalanceDisplay").innerText = "Invalid Ethereum address.";
    document.getElementById("caBalanceDisplay").style.color = "red";
    return;
  }

  try {
    const contract = new web3.eth.Contract(contractABI, contractAddress); // 스마트 컨트랙트 인스턴스 생성

    // 사용자의 CA Balance 조회
    const balance = await contract.methods.getCABalance(userAddress).call();

    // 결과 출력
    document.getElementById("caBalanceDisplay").innerText = `CA User Balance: ${balance} Tokens`;
    document.getElementById("caBalanceDisplay").style.color = "green";
    console.log(`Balance of ${userAddress}: ${balance} Tokens`);
  } catch (err) {
    console.error("Failed to fetch CA user balance:", err);
    document.getElementById("caBalanceDisplay").innerText = "Failed to fetch CA user balance.";
    document.getElementById("caBalanceDisplay").style.color = "red";
  }
});



// Get Contract Balance 버튼 이벤트 리스너
document.getElementById("getContractBalanceButton").addEventListener("click", async () => {
  try {
    // 스마트 컨트랙트의 이더리움 잔액 조회
    const balanceWei = await web3.eth.getBalance(contractAddress); // 컨트랙트 주소의 잔액 가져오기
    const balanceEth = web3.utils.fromWei(balanceWei, "ether"); // Wei -> Ether 변환

    // 결과 출력
    document.getElementById("contractBalanceDisplay").innerText = `Contract Balance: ${balanceEth} ETH`;
    document.getElementById("contractBalanceDisplay").style.color = "green";
    console.log("Contract Balance:", balanceEth);
  } catch (err) {
    console.error("Failed to fetch contract balance:", err);
    document.getElementById("contractBalanceDisplay").innerText = "Failed to fetch contract balance.";
    document.getElementById("contractBalanceDisplay").style.color = "red";
  }
});












/*


// getCABalance 버튼 이벤트 리스너
// Contract Balance 버튼 이벤트 리스너
document.getElementById("contractBalanceButton").addEventListener("click", async () => {
  const userAddress = document.getElementById("contractAddressInput").value; // 입력된 사용자 주소 가져오기

  if (!web3.utils.isAddress(userAddress)) {
    // 유효한 주소인지 확인
    document.getElementById("contractBalanceDisplay").innerText = "Invalid address.";
    document.getElementById("contractBalanceDisplay").style.color = "red";
    return;
  }

  try {
    const contract = new web3.eth.Contract(contractABI, contractAddress); // 스마트 계약 인스턴스 생성

    // 사용자의 CA Balance 조회
    const balanceWei = await contract.methods.getCABalance(userAddress).call(); 
    const balanceEth = web3.utils.fromWei(balanceWei, "ether"); // ETH 단위 변환

    // Total Supply 조회
    const totalSupply = await contract.methods.totalSupply().call();

    // 결과 출력
    document.getElementById("contractBalanceDisplay").innerHTML = `
      <strong>Balance:</strong> ${balanceEth} ETH<br>
      <strong>Total Supply:</strong> ${totalSupply} Tokens
    `;
    document.getElementById("contractBalanceDisplay").style.color = "green";

    console.log(`Balance of ${userAddress}: ${balanceEth} ETH`);
    console.log(`Total Supply: ${totalSupply} Tokens`);
  } catch (err) {
    console.error("Failed to fetch user balance or total supply:", err);
    document.getElementById("contractBalanceDisplay").innerText = "Failed to fetch data.";
    document.getElementById("contractBalanceDisplay").style.color = "red";
  }
});



// Ether와 메시지 전송
document.getElementById("sendWithMessageButton").addEventListener("click", async () => {
  const sender = document.getElementById("senderAddress").value; // 송신자 주소
  const recipient = document.getElementById("recipientAddress").value; // 수신자 주소
  const amount = document.getElementById("amountWithMessage").value; // 전송 금액
  const message = document.getElementById("messageContent").value; // 메시지

  if (!sender || !recipient || !amount || !message) {
    alert("Please fill in all fields..");
    return;
  }

  try {
    const amountWei = web3.utils.toWei(amount, "ether"); // Ether -> Wei 변환
    const data = web3.utils.toHex(message); // 메시지를 Hex로 변환

    const transaction = {
      from: sender,
      to: recipient,
      value: amountWei,
      data: data, // 메시지 포함
    };

    const result = await web3.eth.sendTransaction(transaction);
    document.getElementById("transactionHash").innerText = `트랜잭션 해시: ${result.transactionHash}`;
    document.getElementById("transactionHash").style.color = "green";
    console.log("Transaction Result:", result);
  } catch (error) {
    console.error("Transaction Error:", error);
    alert("Failed to send transaction.");
  }
});

// 트랜잭션에서 메시지 복호화
document.getElementById("decodeTransactionButton").addEventListener("click", async () => {
  const hash = document.getElementById("transactionHashInput").value.trim();

  if (!hash) {
    alert("Please enter the transaction hash.");
    return;
  }

  try {
    const transaction = await web3.eth.getTransaction(hash);

    if (transaction.input && transaction.input !== "0x") {
      const decodedMessage = web3.utils.hexToUtf8(transaction.input); // Hex -> UTF-8 변환
      document.getElementById("decodedMessage").innerText = `메시지: ${decodedMessage}`;
      document.getElementById("decodedMessage").style.color = "green";
    } else {
      alert("This transaction does not contain a message.");
    }
  } catch (error) {
    console.error("Transaction Decoding Error:", error);
    alert("Failed to decode the transaction.");
  }
});

// 9번: Send with CA Data 버튼 이벤트 리스너
document.getElementById("sendWithCADataButton").addEventListener("click", async () => {
  const fromAddress = document.getElementById("fromCAAddress").value;
  const message = String(document.getElementById("messageCAContent").value); // 문자열로 변환
  const etherAmount = document.getElementById("etherAmountCA").value; // 사용자 입력 이더리움 양

  if (!web3.utils.isAddress(fromAddress)) {
    document.getElementById("caTransactionStatus").innerText = "Invalid Ethereum address.";
    document.getElementById("caTransactionStatus").style.color = "red";
    return;
  }

  if (!message) {
    document.getElementById("caTransactionStatus").innerText = "Message is required.";
    document.getElementById("caTransactionStatus").style.color = "red";
    return;
  }

  if (!etherAmount || isNaN(etherAmount) || parseFloat(etherAmount) <= 0) {
    document.getElementById("caTransactionStatus").innerText = "Valid Ether amount is required.";
    document.getElementById("caTransactionStatus").style.color = "red";
    return;
  }

  try {
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const result = await contract.methods.mint(1, message).send({
      from: fromAddress,
      value: web3.utils.toWei(etherAmount, "ether"), // 사용자가 입력한 이더리움 양
      gas: 500000, // 적절한 Gas Limit
    });

    document.getElementById("caTransactionStatus").innerText = `Transaction Hash: ${result.transactionHash}`;
    document.getElementById("caTransactionStatus").style.color = "green";
    console.log("CA Data Sent Transaction:", result);
  } catch (err) {
    console.error("Failed to send CA data:", err);
    document.getElementById("caTransactionStatus").innerText = `Failed to send CA data: ${err.message}`;
    document.getElementById("caTransactionStatus").style.color = "red";
  }
});




// 10번: Get CA Transaction Data 버튼 이벤트 리스너
document.getElementById("getCATxDataButton").addEventListener("click", async () => {
  const txHash = document.getElementById("caTxHashInput").value; // 트랜잭션 해시값

  if (!txHash) {
    document.getElementById("caTxDataDisplay").innerText = "Transaction hash is required.";
    document.getElementById("caTxDataDisplay").style.color = "red";
    return;
  }

  try {
    const tx = await web3.eth.getTransaction(txHash); // 트랜잭션 정보 가져오기

    if (tx) {
      const inputData = tx.input;
      
      let decodedMessage = "No input data";
      if (inputData && inputData !== "0x") {
        // Function Selector 제거 (첫 4바이트)
        const data = inputData.slice(10); // 4바이트 이후의 데이터 추출
        try {
          // mint 함수의 파라미터 디코딩
          const decoded = web3.eth.abi.decodeParameters(
            ['uint256', 'string'], // mint 함수의 파라미터 타입
            data
          );
          decodedMessage = decoded[1]; // 메시지는 두 번째 파라미터
        } catch (decodeError) {
          console.error("Failed to decode input data:", decodeError);
        }
      }

      document.getElementById("caTxDataDisplay").innerHTML = `
        <strong>Transaction Hash:</strong> ${tx.hash}<br>
        <strong>From:</strong> ${tx.from}<br>
        <strong>To:</strong> ${tx.to}<br>
        <strong>Value:</strong> ${web3.utils.fromWei(tx.value, "ether")} ETH<br>
        <strong>Input Data:</strong> ${decodedMessage}<br>
      `;
      document.getElementById("caTxDataDisplay").style.color = "green";
    } else {
      document.getElementById("caTxDataDisplay").innerText = "Transaction not found.";
      document.getElementById("caTxDataDisplay").style.color = "red";
    }
  } catch (err) {
    console.error("Failed to fetch transaction data:", err);
    document.getElementById("caTxDataDisplay").innerText = "Failed to fetch transaction data.";
    document.getElementById("caTxDataDisplay").style.color = "red";
  }
});



*/
