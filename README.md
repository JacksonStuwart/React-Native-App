# React-Native-App
## App to monitor personal allowance, To-Do-List, Crypto Calculator and a Password Manager with AES encryption
## Framework
  * **React-Native**
  * **Firebase** 
## Working Details - _[Project-Demo-Video](https://github.com/JacksonStuwart/React-Native-App/blob/master/Project-Demo_Video.mp4)_
 * ### Allowance
    * In home page you have input section to update your Expenditure
    * After submition of your expenditure, you can navigate to **Details** and see all your expenditures
    * Now you can see, delete inaccurate data in details page also you can see Total and Average amount spent on a day, month, year respectively 
 * ### To-Do-List
    * Navigate to **To-Do-List** where you can update your tasks, and simply delete them by long pressing it
 * ### Crypto Calculator
    * Navigate to Crypto calculator it has two inputs, in the first input you have to enter the maximum supply of the coin for which you need to calculate the max price
    * In second input you have to enter the current bitcoin's price in USD
    * maximum supply of the coin and current bitcoin's price data are available at **_[coinmarketcap](https://coinmarketcap.com/)_** and other similar Websites
 * ### Password Manager
    * Navigating to password manager is tricky, since you need to enter unique key combo to navigate, the procedure is shown in demo video provided
    * In password manager page it requires a **KEY (_password_)** to be entered, this key is used in **AES Encryption** which produce hash string for
      the login credentials provided by user in addKeys section
    * After you add your login credentials, it is stored in Firebase **Real-time-datebase** as **Hash string** inorder to retrive it, you need **KEY (_password_)** 
      to be entered and click GetKeys button, So the hash string from the firebase is decrypted using **AES Decryption** and all the passwords stored are shown
## Usage
 ### Run Commands
   * **npm install** - _( installs all the required dependencies )_
   * **npm start** - _( you can use an Emulator/Expo app to see the output  )_
 ### Note
   * **Firebase SDK** values are not provided in **.env** file .
   * You cannot login and use the application without Firebase SDK .
   * You could get you own Firebase SDK at **[Firebase](https://firebase.google.com/)** by creating a new project in it .
