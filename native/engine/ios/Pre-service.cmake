# Supported for Cocos Service!
        if(USE_ANALYTICS)
            list(APPEND CC_ALL_SOURCES
                ${CMAKE_CURRENT_LIST_DIR}/service/ServiceAnalytics.h
                ${CMAKE_CURRENT_LIST_DIR}/service/ServiceAnalytics.m
            )
        endif()