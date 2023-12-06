const mumbaiAddress = `0x3877f5823B2a0762Bec527d5d0D68b9cd8449cFB`
const fujiAddress = ``

export const registryAddress = mumbaiAddress

export const registryAbi = `[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_chainId",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_modelId",
				"type": "uint256"
			}
		],
		"name": "buyModel",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_modelId",
				"type": "uint256"
			}
		],
		"name": "callImageAdGen",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "createModel",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_modelId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "response",
				"type": "address"
			}
		],
		"name": "fallbackImageAdGenAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "fetchAllModel",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "tba",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "imgAdGen",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "modelId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "modelNFT",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "creator",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "uint128",
						"name": "price",
						"type": "uint128"
					},
					{
						"internalType": "bool",
						"name": "sale",
						"type": "bool"
					}
				],
				"internalType": "struct Registry.ModelAcc[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "idToModelAcc",
		"outputs": [
			{
				"internalType": "address",
				"name": "tba",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "imgAdGen",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "modelId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "modelNFT",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint128",
				"name": "price",
				"type": "uint128"
			},
			{
				"internalType": "bool",
				"name": "sale",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "imgAdGen",
		"outputs": [
			{
				"internalType": "contract ImageAdGen",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_modelId",
				"type": "uint256"
			},
			{
				"internalType": "uint128",
				"name": "_price",
				"type": "uint128"
			}
		],
		"name": "listModelForSale",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "modelGen",
		"outputs": [
			{
				"internalType": "contract ModelGen",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]`