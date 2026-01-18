#include <bits/stdc++.h>
using namespace std;

// Run solve_binary by writing input to a temp file and capturing output

string run_solution(const string &input) {
  // Write input to temp file
  {
    ofstream fout("tmp_input.txt");
    fout << input;
  }

  // Execute solve_binary using input redirection
  system("./solve_binary < tmp_input.txt > tmp_output.txt");

  // Read output
  ifstream fin("tmp_output.txt");
  string output((istreambuf_iterator<char>(fin)), istreambuf_iterator<char>());
  fin.close();

  // Remove temp files
  remove("tmp_input.txt");
  remove("tmp_output.txt");

  return output;
}

// Test a single test case: compare output with expected
bool test_case(const string &input_file, const string &expected_file) {
  ifstream in(input_file);
  ifstream ex(expected_file);

  // Read entire input and expected output files
  string input((istreambuf_iterator<char>(in)), istreambuf_iterator<char>());
  string expected((istreambuf_iterator<char>(ex)), istreambuf_iterator<char>());

  string output = run_solution(input);

  auto trim = [](string s) {
    s.erase(remove_if(s.begin(), s.end(),
                      [](unsigned char c) { return isspace(c); }),
            s.end());
    return s;
  };

  return trim(output) == trim(expected);
}
int main() {
  vector<pair<string, string>> tests = {
      {"test/input1.txt", "test/expected1.txt"},
      {"test/input2.txt", "test/expected2.txt"},
  };
cout << "===TEST_OUTPUT===\n";
  cout << "{\n  \"tests\": [\n";

  for (size_t i = 0; i < tests.size(); i++) {
    auto &t = tests[i];
    bool ok = test_case(t.first, t.second);

    string inputName = t.first.substr(t.first.find_last_of('/') + 1);

    cout << "    {\n";
    cout << "      \"input\": \"" << inputName << "\",\n";
    cout << "      \"status\": \"" << (ok ? "PASS" : "FAIL") << "\"\n";
    cout << "    }";

    if (i + 1 < tests.size()) cout << ",";
    cout << "\n";
  }

  cout << "  ]\n}\n";
}
