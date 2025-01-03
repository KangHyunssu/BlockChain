# 블록체인 프로젝트 🌐

Ethereum 스마트 컨트랙트와 상호작용하는 프로젝트로, Web3.js와 MetaMask를 사용해 다양한 블록체인 기능을 제공합니다. 이 프로젝트는 사용자가 MetaMask를 연결하고, 계정을 관리하며, 토큰 민팅 및 트랜잭션 전송, 잔액 조회 등을 수행할 수 있도록 설계되었습니다. HTML, CSS, JavaScript를 사용하여 인터페이스가 구축되었습니다.

---

## 🖥️ 메인 화면
<img width="400" alt="image" src="https://github.com/user-attachments/assets/7f269ed9-5ec8-4cae-84d1-b5c06c983d4c" />


---

## 📂 프로젝트 구조

### 포함된 파일:
- **`index.html`**: 사용자 인터페이스를 제공하는 메인 HTML 파일.
- **`styles.css`**: 프로젝트의 레이아웃과 스타일을 정의한 CSS 파일.
- **`main.js`**: 블록체인 상호작용 및 사용자 액션 처리를 위한 JavaScript 로직.
- **`mint2.sol`**: 토큰 민팅과 잔액 관리를 처리하는 Solidity 스마트 컨트랙트.
- **`mint_sol_Mint.abi`**: 배포된 스마트 컨트랙트의 ABI (Application Binary Interface).
- **`mint_sol_Mint.bin`**: 스마트 컨트랙트 배포를 위한 컴파일된 바이너리 파일.

---

## ✨ 주요 기능

### 1. **MetaMask 통합 🦊**
   - MetaMask 연결 및 연결 상태 표시.
   - MetaMask 미설치 또는 미연결 시 에러 메시지 처리.

### 2. **계정 관리 👤**
   - 연결된 Ethereum 계정 표시.
   - 선택한 계정의 잔액 조회 및 표시.

### 3. **트랜잭션 관리 💸**
   - 계정 간 이더(Ether) 전송.
   - 트랜잭션 성공 및 실패 상태 출력.

### 4. **토큰 민팅 기능 🪙**
   - 스마트 컨트랙트를 통해 특정 주소에 토큰 민팅.
   - 총 발행된 토큰 수량과 사용자별 잔액 표시.

### 5. **스마트 컨트랙트 상호작용 🔗**
   - 스마트 컨트랙트에 저장된 총 토큰 수량 조회.
   - 스마트 컨트랙트의 이더 잔액 확인.
   - 스마트 컨트랙트에 저장된 사용자별 토큰 잔액 조회.

---

## 🚀 사용 방법

### 필수 조건
1. **MetaMask 설치**: MetaMask 브라우저 확장 프로그램을 설치하세요.
2. **Node.js 설치**: Node.js가 필요합니다. 설치하지 않았다면 [Node.js 공식 웹사이트](https://nodejs.org/)에서 다운로드하세요.
3. **Ganache**: 로컬 블록체인 환경을 위해 Ganache를 사용하세요.

### 실행 방법
1. **스마트 컨트랙트 배포**
   - `mint2.sol` 파일을 Remix IDE에서 컴파일 및 배포합니다.
   - ABI와 컨트랙트 주소를 `main.js`에 추가합니다.

2. **프로젝트 실행**
   - HTML 파일을 브라우저에서 열어 인터페이스를 실행합니다.
   - MetaMask에 연결된 네트워크가 배포된 스마트 컨트랙트와 일치해야 합니다.

3. **기능 사용**
   - **MetaMask 연결**: MetaMask 버튼을 눌러 연결합니다.
   - **계정 확인**: 연결된 계정을 확인합니다.
   - **트랜잭션 전송**: 출발지와 목적지 주소 및 전송 금액을 입력해 이더를 전송합니다.
   - **토큰 민팅**: 특정 주소에 토큰을 민팅합니다.

---
