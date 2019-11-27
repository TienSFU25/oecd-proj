#!/usr/bin/env python3

import json
import numpy as np
from scipy.stats import pearsonr
import matplotlib.pyplot as plt
'''
Objective 1: 
    How many placeholders do we want.
    Each country has how many skills in how many categories
    
'''

DEBUG = False

def main():
    with open('SKILLS_2018_TOTAL_25102019044734209.csv') as f:
        _ = f.readline()        #intentionally ignore first line
        lines = f.readlines();
    
    if DEBUG:
        analyze(lines)
    
    # Get a vector of skills for each country
    #     The skill list should be equalized
    #     The number of categories and subcategories should be equal
    #     We have to build a hierarchical dictionary
    
    processed_dict = extract_tokens(lines, '"', False)
    #flatData  = getFlatSkillValue(processed_dict)
    sValue_mat, labels, cats, countries = get_cats(processed_dict)

    #data = {'cm':corr_mat, 'skills':labels, 'categories': cats, 'countries':countries}
    print("cats : {}".format(len(cats)))
    print(cats)
    
    ### Recoding
    dataFinal = {}
    for idx,ci in enumerate(cats[0]):
        tTemp = {}
        for idy,cj in enumerate(countries):
            temp = {}
            for idz, cz in enumerate(labels[idx]):
                temp[cz] = sValue_mat[idx][idy][idz]

            tTemp[cj] = temp
        #print(tTemp)
        dataFinal[ci] = tTemp

    with open('parsed_skills_data.json', 'w') as f:
        json.dump(dataFinal, f)

    #with open('correlation_mat.json', 'w') as f:
    #    json.dump(data, f)

    # for idx, mat in enumerate(corr_mat):
    #     mat = np.array(mat)
    #     print(mat.shape)
    #     print(len(labels[idx]))
    #     #print(len(cats[idx]))
    #     print( cats[idx] )
    #     #print(labels[idx])

    #     fig, ax = plt.subplots(1,1, figsize=(6,6))
        
    #     # ax_arr[0,0].imshow(corr_mat[0], cmap=plt.cm.YlGn, interpolation='none')
    #     # ax_arr[0,0].set_title('1')
                
    #     # ax_arr[0,1].imshow(corr_mat[0], cmap=plt.cm.YlGn, interpolation='none')
    #     # ax_arr[0,1].set_title('2')

    #     # ax_arr[1,0].imshow(corr_mat[0], cmap=plt.cm.YlGn, interpolation='none')
    #     # ax_arr[1,0].set_title('3')

    #     # ax_arr[1,1].imshow(corr_mat[0], cmap=plt.cm.YlGn, interpolation='none')
    #     # ax_arr[1,1].set_title('4')


    #     # ax_arr[0].set_xticks(range(41))
    #     ax.imshow(mat, cmap=plt.cm.YlGn, interpolation='none')
    #     ax.set_title(cats[idx][idx])
    #     ax.set_yticks(range(41))
    #     ax.set_xticks(range(41))
    #     ax.set_xticklabels(countries, rotation ='vertical', fontsize=10)
    #     ax.set_yticklabels(countries)
    #     plt.subplots_adjust(left=0.12, bottom=0.2, top=0.93, right=0.93)
    #     #plt.yticks(labels)
    #     plt.show()
    #     #print(len(labels))

def get_cats(data):
    '''Extract each category wise data'''
    
    M = [[],[],[],[]]
    ticks = [[],[],[],[]]
    CSkill = [[],[],[],[]]
    country_skill_val = {}
    countriesK=[]
    ## No calculations for these 
    ExcludeList= ['Malaysia', 'OECD - Total']
    for k in data.keys():

        if(k in ExcludeList):
            continue
        countriesK.append(k)
        ssList = []
        vvList = []
        skillCat=[]        
        if DEBUG:
            print("Country {} has :".format(k))
        skills = {}
        categories = {}

        for s in data[k].keys():
            ## print(s)
            skCatList = data[k][s]
            skills[s]  = len(skCatList)
            sList = []
            vList = []
            for skill in skCatList: ## get the dict containing {skill : value}
                for ki, val in skill.items():  ## there is only 1 item in this dict
                
                    sList.append(ki)
                    vList.append(val)
            ssList.append(sList)
            vvList.append(vList)
            print(len(sList), len(ssList))
            print(len(vList), len(vvList))
            skillCat.append(s)
        if DEBUG:
            print("\n\t{} skills:\t\t {}".format(len(skills.keys()), skills))
        country_skill_val[k] = {'skill_labels':ssList, 'skill_values':vvList, 'skill_category':skillCat}
    
    ##  from the matrix with rows from each country
    ##  This matrix will be used to calculate the correlation
    ##  
    for k,v in country_skill_val.items():
        
        for i in range(4):
            M[i].append(v['skill_values'][i])
            ticks[i] = v['skill_labels'][i]
            CSkill[i] = v['skill_category']
            
    #print(len(M), len(M[0]), len(M[3][0]) )
    #print(len(ticks), len(ticks[0]), len(ticks[0][0]))

    CM = []
    for i in range(4):
        CM.append(M[i])
    return CM, ticks, CSkill, countriesK


def getCorrelation_cat(data):
    '''Extract each category and calculate the corrcoef'''
    
    M = [[],[],[],[]]
    ticks = [[],[],[],[]]
    CSkill = [[],[],[],[]]
    country_skill_val = {}
    countriesK=[]
    ## No calculations for these 
    ExcludeList= ['Malaysia', 'OECD - Total']
    for k in data.keys():

        if(k in ExcludeList):
            continue
        countriesK.append(k)
        ssList = []
        vvList = []
        skillCat=[]        
        if DEBUG:
            print("Country {} has :".format(k))
        skills = {}
        categories = {}

        for s in data[k].keys():
            ## print(s)
            skCatList = data[k][s]
            skills[s]  = len(skCatList)
            sList = []
            vList = []
            for skill in skCatList: ## get the dict containing {skill : value}
                for ki, val in skill.items():  ## there is only 1 item in this dict
                
                    sList.append(ki)
                    vList.append(val)
            ssList.append(sList)
            vvList.append(vList)
            print(len(sList), len(ssList))
            print(len(vList), len(vvList))
            skillCat.append(s)
        if DEBUG:
            print("\n\t{} skills:\t\t {}".format(len(skills.keys()), skills))
        country_skill_val[k] = {'skill_labels':ssList, 'skill_values':vvList, 'skill_category':skillCat}
    
    ##  from the matrix with rows from each country
    ##  This matrix will be used to calculate the correlation
    ##  
    for k,v in country_skill_val.items():
        
        for i in range(4):
            M[i].append(v['skill_values'][i])
            ticks[i] = v['skill_labels'][i]
            CSkill[i] = v['skill_category']
            
    #print(len(M), len(M[0]), len(M[3][0]) )
    #print(len(ticks), len(ticks[0]), len(ticks[0][0]))

    CM = []
    for i in range(4):
        CM.append(np.corrcoef(np.array(M[i])).tolist())
    return CM, ticks, CSkill, countriesK

    
def getCorrelation(data):
    M = []
    labels = []
    for k1,v1 in data.items():
        #print v1
        M.append(v1[1])
        labels.append(k1)
    M = np.array(M)
    print("size info : {}".format(M.shape))
    CM = np.corrcoef(M)
    return CM, labels


def getFlatSkillValue(data):
    '''given the processed_dict, gives one dict with key=country, val=[skills, values]
    '''
    ccoherence = {}

    ## No calculations for these 
    ExcludeList= ['Malaysia', 'OECD - Total']
    for k in data.keys():
        if(k in ExcludeList):
            continue
        ssList = []
        vvList = []        
        if DEBUG:
            print("Country {} has :".format(k))
        skills = {}
        categories = {}
        sList = []
        vList = []
        for s in data[k].keys():
            skCatList = data[k][s]
            skills[s]  = len(skCatList)
            
            for skill in skCatList:
       
                for ki, val in skill.items():
                
                    sList.append(ki)
                    vList.append(val)
            ssList +=sList
            vvList +=vList
        if DEBUG:
            print("\n\t{} skills:\t\t {}".format(len(skills.keys()), skills))
        ccoherence[k] = [ssList, vvList]
    return ccoherence

def equilize(a,b):
    n = ["nil" for i in b]
    for val in a:
        n[b.index(val)] = val
    return n

def extract_tokens(lines, delim=',', even=True):
    '''Extract only even tokens'''

    countries = {}
    
    for line in lines:
        if even:
            Code, _, country, _, skType, _,  _, _, skCode, _, skTitle, _, _, _, _, _, Value, _,_,_,_,_ = line.strip().split(delim)
        else:
            _, Code, _, country, _, _, _,  skType, _, skCode, _, skTitle, _, _, _, _, Value = line.strip().split(delim)
        
        if DEBUG:
            print("code: {}, country: {}, SkillType:{}, skillCode:{}, skillTitle:{}, Value:{}".format(Code, country, skType, skCode, skTitle, Value))
        
        if not country in countries.keys():
            countries[country] = {skType: [{skTitle : float(Value.strip(','))}]}
        else:
            if not skType in countries[country].keys():
                countries[country][skType] = [{skTitle :  float(Value.strip(','))}]
            else:
                countries[country][skType].append({skTitle: float(Value.strip(','))})
        
    return countries

def analyze(lines, delim='"'):
    "Do these lines contain consistent `delim` separated tokens"
    
    token_len_dict = {}
    counts = []
    bad_lines = []


    for line in lines:
        n = len(line.strip().split(delim));
        
        ## Add this count to `token_len_dict` if not seen earlier
        if not n in counts:
            counts.append(n)
            token_len_dict[str(n)]=1
        else:                           ## Increment the count that has been seen earlier
            token_len_dict[str(n)]+=1
    
    ## Filter odd token counts    
    #    if n==12:
    #        bad_lines.append(line)

    if len(token_len_dict.keys()) == 1:
        keys = [ k for k in token_len_dict.keys()]
        print("Consistent data with {} tokens in {} lines".format(keys[0], token_len_dict[keys[0]]))
    else:
        print("Inconsistent data with varying number of tokens: Statistics : {}".format(token_len_dict))
    

if __name__ == '__main__':
    main()
