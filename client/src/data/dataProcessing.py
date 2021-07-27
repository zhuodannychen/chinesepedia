# reconverting traditional to traditional because some don't convert

import json
oldTrad = open('tradCharacters.json')
oldData = json.load(oldTrad)
oldTrad.close()

tradFile = open('newTrad.txt', 'r')
newTrad = list(tradFile.read().split())
# print(newTrad)

cnt = 0
for ch in oldData:
    ch['hanzi'] = newTrad[cnt]
    cnt += 1
    # print(ch['hanzi'], end=" ")
print(oldData)

oldTrad = open("tradCharacters.json", "w")
json.dump(oldData, oldTrad, ensure_ascii=False)
oldTrad.close()
