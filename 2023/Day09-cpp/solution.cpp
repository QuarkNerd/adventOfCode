#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>

using namespace std;

bool all_zeros(vector<int> numbers){
    return numbers[0] == 0 &&
        std::equal(numbers.begin() + 1, numbers.end(), numbers.begin());
}

vector<int> calculate_differences(vector<int> numbers)
{
    vector<int> result;
    for (int i = 0; i < numbers.size() - 1; i++)
    {
        result.push_back(numbers[i + 1] - numbers[i]);
    }
    return result;
}

tuple<int, int> calculateSurroundingElement(vector<int> numbers)
{
    int next = 0;
    int previous = 0;
    int i = 0;
    do {
        next += numbers.back();
        previous += numbers.front() * (i%2 == 0 ? 1 : -1);
        numbers = calculate_differences(numbers);
        i++;
    } while (!all_zeros(numbers));

    return make_pair(previous, next);
}

int main()
{
    ifstream f("input");
    string s;
    int total_next = 0;
    int total_previous = 0;
    while (getline(f, s))
    {
        istringstream string_f(s);
        string num;
        vector<int> numbers;
        while (getline(string_f, num,' ')) {
            numbers.push_back(std::stoi(num));
        }
        tuple<int, int> surr = calculateSurroundingElement(numbers);
        total_next += get<1>(surr);
        total_previous += get<0>(surr);
    }
    cout << std::to_string(total_next) << endl;
    cout << std::to_string(total_previous) << endl;
}
