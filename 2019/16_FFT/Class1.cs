using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _16_FFT
{
    class Program
    {

        public static void Main() 
        {
            string input = string.Concat(Enumerable.Repeat("59767332893712499303507927392492799842280949032647447943708128134759829623432979665638627748828769901459920331809324277257783559980682773005090812015194705678044494427656694450683470894204458322512685463108677297931475224644120088044241514984501801055776621459006306355191173838028818541852472766531691447716699929369254367590657434009446852446382913299030985023252085192396763168288943696868044543275244584834495762182333696287306000879305760028716584659188511036134905935090284404044065551054821920696749822628998776535580685208350672371545812292776910208462128008216282210434666822690603370151291219895209312686939242854295497457769408869210686246", 10000));

            for (int i = 0; i < 100; i++ )
            {
                input = calculateFFT(input);
           Console.WriteLine(input.Substring(5976733, 5976733+8));
            }
            Console.WriteLine(input.Substring(0, 50));
        }
        private static string calculateFFT(string input)
        {
            var basePhase = new List<int> { 0, 1, 0, -1 };
            string output = "";

            for (int i = 0; i < input.Count(); i++)
            {
                int newDigit = 0;
                for (int j = 0; j < input.Count(); j++)
                {

                    int digitMultiplied = (int)Char.GetNumericValue(input[j]) * basePhase[((j + 1) / (i + 1)) % 4];
                    newDigit += digitMultiplied;
                }

                output = output + (Math.Abs(newDigit)%10).ToString();
            }
        return output;
        }

    }
}
