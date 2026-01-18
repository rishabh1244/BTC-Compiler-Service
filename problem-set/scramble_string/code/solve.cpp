#include <bits/stdc++.h>
using namespace std;
unordered_map<string, bool> mp;

bool solve(const string &s1, const string &asds2) {
  string key = s1 + "|" + s2;
  if (mp.count(key))
    return mp[key];

  if (s1 == s2)
    return mp[key] = true;

  int n = s1.size();

  string a = s1, b = s2;
  sort(a.begin(), a.end());
  sort(b.begin(), b.end());
  if (a != b)
    return mp[key] = false;

  for (int i = 1; i < n; i++) {
    if (solve(s1.substr(0, i), s2.substr(0, i)) &&
        solve(s1.substr(i), s2.substr(i)))
      return mp[key] = true;

    if (solve(s1.substr(0, i), s2.substr(n - i)) &&
        solve(s1.substr(i), s2.substr(0, n - i)))
      return mp[key] = true;
  }

  return mp[key] = false;
}
bool isScramble(string s1, string s2) {
  int n = s1.size();
  if (n != s2.size())
    return false;
  if (s1 == s2)
    return true;

  string a = s1, b = s2;
  sort(a.begin(), a.end());
  sort(b.begin(), b.end());
  if (a != b)
    return false;

  return solve(s1, s2);
}

int main() {
  string s1, s2;
  cin >> s1 >> s2;
  cout << isScramble(s1, s2);
}
