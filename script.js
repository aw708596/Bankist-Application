'use strict';
console.log(`---BANKIST APP---`);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Ahmed',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2021-12-02T23:36:17.929Z',
    '2021-12-03T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'nun',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let movDate;
function formatMovementDates(dat) {
  const calcDaysPassed = (date1, date2) => {
    return Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
  };

  const daysPassed = Math.round(calcDaysPassed(new Date(), dat));
  console.log(daysPassed);

  if (daysPassed === 0) return `Today`;
  if (daysPassed === 1) return `Yesterday`;
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(`en-Us`).format(dat);
}

// Currency Formatting Function
let formattedMov;
function formatCur(acc, format) {
  formattedMov = new Intl.NumberFormat(acc.locale, {
    style: `currency`,
    currency: acc.currency,
  }).format(format);
  return formattedMov;
}

// This function diplays deposits and withdraws
function displayMovements(acc, sort = false) {
  containerMovements.innerHTML = '';
  // Sorting Movements Array
  const mov = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  mov.forEach(function (move, index) {
    const type = move > 0 ? 'deposit' : 'withdrawal';
    movDate = new Date(acc.movementsDates[index]);
    let displayDate = formatMovementDates(movDate);

    // Foramtiing currency ....
    formatCur(currentAccount, move);
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div> <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

// Creating Usernames Function
function createUsername(accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
}
createUsername(accounts);

// Balance Calculation Function
function calcPrintBalance(acc) {
  acc.balance = acc.movements.reduce((acc, curr) => {
    return acc + curr;
  });
  labelBalance.textContent = formatCur(acc, acc.balance);
}

//  Summary calculation Functionality
function calcdisplaySummary(acc) {
  // Making Deposits
  let income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  // Making WithDrawals
  let out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);
  // Making Interest
  let interest = acc.movements
    .filter(mov => mov > 0)
    .map(int => (int * acc.interestRate) / 100)
    .filter(depsoit => depsoit > 1)
    .reduce((acc, int) => acc + int, 0);
  // Putting things in their respective Places
  labelSumIn.textContent = formatCur(acc, income);
  labelSumOut.textContent = formatCur(acc, Math.abs(out));
  labelSumInterest.textContent = formatCur(acc, interest);
}

// Updating the UI - Function
function updateUi(acc) {
  // Displaying the Movements of current Account
  displayMovements(acc);

  // Displaying the summary of current Account
  calcdisplaySummary(acc);

  // Displaying Current Account Balance
  calcPrintBalance(acc);
}

// Logout timer down here

function logOutTimer() {
  function tick() {
    let minute = String(Math.trunc(time / 60)).padStart(2, 0);
    let second = String(Math.trunc(time % 60)).padStart(2, 0);
    labelTimer.textContent = `${minute}:${second}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Login to get started`;
      containerApp.style.opacity = 0;
    }
    time--;
  }
  let time = 100;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}
// Logging in Function
let currentAccount, timer;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  // Finding the currentAccount that logged in
  currentAccount = accounts.find(
    acc => acc.owner === inputLoginUsername.value
  );

  if (currentAccount && currentAccount.pin == inputLoginPin.value) {
    // Displaying Welcome and Ui
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;

    // Setting Current Date for page
    let now = new Date();
    let date = String(now.getDate()).padStart(2, 0);
    let month = String(now.getMonth() + 1).padStart(2, 0);
    let year = now.getFullYear();
    let hour = String(now.getHours()).padStart(2, 0);
    let minute = String(now.getMinutes()).padStart(2, 0);

    let today = `${date}/${month}/${year} , ${hour}:${minute}`;
    labelDate.textContent = today;

    // timer for logging out
    if (timer) clearInterval(timer);
    timer = logOutTimer();

    // Displaying and updating Ui
    updateUi(currentAccount);

    // Clearing Input Fields
    inputLoginUsername.value = inputLoginPin.value = ``;
    inputLoginPin.blur();
  }

  // Transfer Button Functionality
  btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();
    let amount = Number(inputTransferAmount.value);
    let recieverAccount = accounts.find(
      acc => acc.owner === inputTransferTo.value
    );
    console.log(amount, recieverAccount);

    if (
      amount > 0 &&
      recieverAccount &&
      currentAccount.balance >= amount &&
      recieverAccount?.username !== currentAccount.username
    ) {
      // Doing Transfers
      currentAccount.movements.push(-amount);
      recieverAccount.movements.push(amount);

      // Getting transfer/withdrawal Date
      currentAccount.movementsDates.push(new Date().toISOString());
      recieverAccount.movementsDates.push(new Date().toISOString());

      // Updating the Ui
      updateUi(currentAccount);

      // Restting the Input Fields
      inputTransferTo.value = inputTransferAmount.value = ``;

      clearInterval(timer);
      timer = logOutTimer();
    }
  });
});

// Close Button Functionality
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(inputCloseUsername.value ,currentAccount.username ,
    Number(inputClosePin.value) , currentAccount.pin)
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) == currentAccount.pin
    ) {
    // Finding Account to be deleted
    let index = accounts.findIndex(
      acc => acc.owner === currentAccount.username
    );

    // Deleting the Account
    accounts.splice(index, 1);

    // Hiding the Ui when Account is deleted
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = ``;
    labelWelcome.textContent = "We hope to see you again!"
    console.log(`Your Account is Closed`);
  }
});

// Loan Button Functionality
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(dep => dep >= amount * 0.1)) {
    setTimeout(function () {
      // Adding Movement
      currentAccount.movements.push(amount);
      // Loan date
      currentAccount.movementsDates.push(new Date().toISOString());
      // Updating UI
      updateUi(currentAccount);
    }, 2000);
    clearInterval(timer);
    timer = logOutTimer();

    inputLoanAmount.value = ``;
  }
});

// calculating the balance of all accounts
const overallBalance = accounts
  .flatMap(mov => mov.movements)
  .reduce((acc, mov) => acc + mov, 0);

console.log(overallBalance);

// Sort Button Functionality
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// Just a challenge does not provide anything to this program
setInterval(() => {
  let object = {
    hour: `numeric`,
    minute: `numeric`,
    second: `numeric`,
  };
  const time = new Intl.DateTimeFormat(`en-Us`, object).format();
  console.log(time);
}, 1000);
