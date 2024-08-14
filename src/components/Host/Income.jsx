import React, { useEffect, useState } from "react";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';
import { getHostDetails } from "../../api";

export default function Income(){

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [incomeData, setIncomeData] = useState(null)
    const currMonth = (new Date().getMonth() + 1)
    
    useEffect(()=> {
        async function getData(){
            try {
                const data = await getHostDetails()
                setIncomeData(data)
            } catch(err){
                setError(err)
            } finally {
                setLoading(false)
            }
        }
        getData()
    }, [])

    if (loading)
        return (<h1>Loading...</h1>)

    if (error)
        return (<h1>{error}</h1>)

    function formGraphData(){
        const { monthlyTxnAmount } = incomeData
        const currYear = new Date().getFullYear()
        let currYearTxns  = [0]
        monthlyTxnAmount?.forEach(item => {
            if (item.year == currYear){
                currYearTxns.push(...item.month)
            }
        })
        return currYearTxns
    }

    function ReviewsBarChart() {
        const monthlyTxnArray = formGraphData()
        return (
            <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={20}
            >
            <VictoryAxis
                tickValues={
                    [
                        '01', '02', '03', '04',
                        '05', '06', '07', '08',
                        '09', '10', '11', '12'
                    ]
                }
                tickFormat={
                    [
                        'Jan', 'Feb', 'Mar', 'Apr',
                        'May', 'Jun', 'Jul', 'Aug',
                        'Sep', 'Oct', 'Nov', 'Dec'
                    ]
                }
                style={{
                    axis: { stroke: '#FFEAD0' },
                    tickLabels: { fontSize: "5" }, // Adjust the font size here
                }}
            />
            <VictoryAxis
                dependentAxis
                tickFormat={(x) => `$${x}`} // Adjust the format to reduce the unit size
                tickCount={10} // Reduce the number of ticks
                style={{
                    axis: { stroke: '#FFEAD0' },
                    tickLabels: { fontSize: "5" }, // Adjust the font size here
                    grid: { stroke: '#E0E0E0' },
                }}
            />
            <VictoryBar
                data={monthlyTxnArray}
                x="txnDate"
                y="txnAmount"
                style={{
                    data: {
                        fill: ({ datum, index }) => 

                        index === currMonth ? 
                            "#FF8C38" : "#FFEAD0", // Customize bar color based on condition
                        
                    },
                    labels: {
                        fontSize: 12, // Customize the font size of the labels
                    }
                }}
            />
            </VictoryChart>
        );
    }

    function convertToDate(str){
        return str
    }

    function displayTransactions(){
        let displayArray = []
        for(let i=incomeData.txnDetails.length-1; i>=0; i--){
            const data = incomeData.txnDetails[i]
            displayArray.push(
            <div key={`txn-${i}`} className="txn">
                <h1>{`$${data.txnAmount}`}</h1>
                <h3>{convertToDate(data.txnDate)}</h3>
            </div>
            )
        }
        return displayArray
    }
    
    return (
        <div className="host-income-container">
            {incomeData.currentMonthTxnAmount ? <>
            <h2>Income</h2>
            <h3>Total transaction amount- ${incomeData.totalTxnAmount}</h3>
            <h3>Current month transaction amount- <span>${incomeData.currentMonthTxnAmount}</span></h3>
            <div className="income-graph-container">
                {ReviewsBarChart()}
            </div>
            <div className="income-txns-container">
                <div className="title">
                    <h3>Your transactions {`(${incomeData?.txnDetails?.length || '0'})`}</h3>
                    <h4>All transactions</h4>
                </div>
                <div className="txns-container">
                    {incomeData?.txnDetails?.length && displayTransactions()}
                </div>
            </div></> : <h2>No transactions!</h2>}
        </div>
    )
}