I have developed 'Usage Based Invoice' using ts
Step 1: Compile ts file using
	>tsc invoice-generator.ts 
Step 2: run the created js file using node
	Type 1: without passing filepath
		>node invoice-generator.js
	Type 2: passing filepath
		>node invoice-generator.js D:\temp  
Note: 
The values calculated are all rounded to Two decimals as done in sampl test case
If file path is incorrect or not given then it will open the default file provided with this test
I also have provided warning msg if filepath is incorrect
filename is "usage-data.json"